/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	harvestDatasetBySource: function (harvest, source, harvestFinishCallback) {
		'use strict';

		var txt, nuts, nutsVec, idx, name, url, ext, path, num, j, downloadName, zip, info, number,
			fs = require('fs'),
			file = require('./file'),
			processCount = 0;

		function finishCallback(harvestResult) {
			++processCount;

			if (processCount >= harvestResult.vecURL.length) {
				harvestFinishCallback(harvestResult);
			}
		}
		function repairDataset(buffer, harvest, idx, txt) {
			if (-1 !== buffer.toLowerCase().indexOf('<!doctype html')) {
				// metadata in CKAN portal link to download page and not to the data
				var path = harvest.vecDownload[idx];

				file.loadTXT(path, {txt: txt, harvest: harvest, idx: idx}, function (txt, userData) {
					var pos = txt.indexOf('class="download"'),
						harvest = userData.harvest,
						idx = userData.idx,
						url = '',
						downloadName,
						ext;

					if (-1 !== pos) {
						pos = txt.indexOf('href="', pos) + 6;
						if (-1 !== pos) {
							url = txt.substr(pos, txt.indexOf('"', pos + 1) - pos);
						}
					}

					harvest.vecDownload[idx] = '';

					if (url.length === 0) {
						userData.txt += '[failed to resolve file]';
						console.log(userData.txt);
						finishCallback(harvest);
					} else {
						downloadName = url.substr(url.lastIndexOf('/') + 1);
						if (-1 !== downloadName.lastIndexOf('.')) {
							downloadName = downloadName.substr(0, downloadName.lastIndexOf('.'));
						}
						ext = harvest.vecFormat[idx];

						harvest.vecName[idx] = downloadName;

						file.download(url, harvest.cachePath, downloadName, ext || 'json', {idx: idx, txt: userData.txt, harvest: harvest}, function (path, userData) {
							var harvest = userData.harvest,
								idx = userData.idx,
								txt = userData.txt;

							if (!fs.existsSync(path)) {
								txt += '[failed to download file]';
								console.log(txt);
								finishCallback(harvest);
							} else {
								harvest.vecDownload[idx] = path;
								repairDataset('', harvest, idx, txt);
							}
						});
					}
				});
			} else {
				console.log(txt);
				finishCallback(harvest);
			}
		}

		harvest.vecDownload = [];

		nuts = source.nuts;

		nutsVec = [];
		for (idx = 0; idx < harvest.vecURL.length; ++idx) {
			nutsVec.push(nuts);

			if ((typeof source.nutsVec !== 'undefined') && (typeof source.nutsVec[idx] !== 'undefined')) {
				nutsVec[idx] = source.nutsVec[idx];
			}
		}

		for (idx = 0; idx < harvest.vecURL.length; ++idx) {
			name = harvest.vecName[idx];
			url = harvest.vecURL[idx];
			ext = harvest.vecFormat[idx];

	//		if (0 === url.indexOf('/katalog/storage')) {
	//			url = 'http://data.gv.at' + url;
	//		} else if (0 === url.indexOf('/at.gv.brz.ogd/storage')) {
	//			url = 'http://data.gv.at/katalog/' + url.substr(15);
	//		} else if (0 === url.indexOf('/private/')) {
	//			url = './data' + url;
	//		}

			path = url.substr(url.lastIndexOf('/') + 1);
			if (-1 !== path.lastIndexOf('?')) {
				path = path.substr(0, path.lastIndexOf('?'));
			}
			if (name.length === 0) {
				name = path;
			}
			if (name === '') {
				name = path;
			}

			txt = '';

			txt += nuts;
			for (j = nuts.length; j < 17; ++j) {
				txt += ' ';
			}

			num = (idx + 1).toString() + '/' + (harvest.vecURL.length).toString();
			txt += num;
			for (j = num.length; j < 7; ++j) {
				txt += ' ';
			}

			if ('' === path) {
				txt += 'ignore path: ' + name.substr(0, 45) + ' ';
				for (j = name.length; j < 45; ++j) {
					txt += ' ';
				}

				console.log(txt);
				finishCallback(harvest);
			} else {
				txt += name.substr(0, 45) + ' ';
				for (j = name.length; j < 45; ++j) {
					txt += ' ';
				}

				downloadName = path;

	//			path = 'harvest/' + nutsVec[idx].substr(0, 2) + '/' + nutsVec[idx] + '/' + path;
	//			txt += path;

				file.download(url, harvest.cachePath, downloadName, ext || 'json', {idx: idx, txt: txt, harvest: harvest}, function (path, userData) {
					var txt = userData.txt,
						harvest = userData.harvest,
						idx = userData.idx,
						readStream;

					if (!fs.existsSync(path)) {
						txt += '[failed to download file]';
						console.log(txt);
						finishCallback(harvest);
					} else {
						harvest.vecDownload[idx] = path;

						readStream = fs.createReadStream(path, {start: 0, end: 50});
						readStream.on('open', function () {
							this.myBuffer = '___';
						});
	//					readStream.on('error', function(err) {
	//						res.end(err);
	//					});
						readStream.on('data', function (buffer) {
							this.myBuffer = buffer.toString();
						});
						readStream.on('end', function () {
							repairDataset(this.myBuffer, harvest, idx, txt);
						});

	/*					if ('.zip' === path.substr(-4)) {
							zip = new ZipArchive();
							zip.open('./' + path);

							for (num = 0; num < zip.numFiles; ++num) {
								info = zip.statIndex(num);
								number = (idx + 1) + '.' + (num + 1);
								txt += '<br>' + number;
								for (j = number.length; j < 37; ++j) {
									txt += ' ';
								}

								path = 'harvest/' + nutsVec[idx].substr(0, 2) + '/' + nutsVec[idx] + '/zip_' + info.name.substr(info.name.lastIndexOf('/') + 1);
								txt += path;

								url = 'zip://' + zip.filename + '#' + info.name;

								if (!copy(url, './' + path)) {
									txt += '[failed to unzip file ' + info.name + ']';
								} else {
									harvest.vecDownload.push(path);
								}
							}
						}*/
					}
				});
			}
		}

		if (harvest.vecURL.length === 0) {
			finishCallback(harvest);
		}
	},


	//-------------------------------------------------------------------

	harvest: function (dataSources, metadataResultList, harvestFinishCallback) {
		'use strict';

		var txt, i, harvest, source,
			downloadCount = 0,
			datasetResultList = [];

		function finishCallback(harvestResult) {
			datasetResultList.push(harvestResult);
			downloadCount += harvestResult.vecDownload.length;

			if (datasetResultList.length === metadataResultList.length) {
				console.log('---------------- ------ ---------------------------------------------');
				console.log(downloadCount + ' data sets collected');
				console.log('');

				harvestFinishCallback(datasetResultList);
			}
		}

		console.log('NUTS region      Number Source URL');
		console.log('---------------- ------ ---------------------------------------------');

		for (i = 0; i < metadataResultList.length; ++i) {
			harvest = metadataResultList[i];
			source = dataSources[harvest.sourceId];

			this.harvestDatasetBySource(harvest, source, function (harvestResult) {
				finishCallback(harvestResult);
			});
		}
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
