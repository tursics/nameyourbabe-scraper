/*jslint browser: true*/
/*global console,require*/

//-----------------------------------------------------------------------

function harvestMetadata(dataSources, harvestFinishCallback) {
	'use strict';

	var file = require('./lib/file'),
		i,
		j,
		txt,
		dataData,
		name,
		uri,
		result,
		nutsList = [],
		counts,
		processCount = 0,
		lastMod,
		diffMod,
		metadataResultList = [];

	function finishCallback(metadataResult) {
		++processCount;

		if (null !== metadataResult) {
			metadataResultList.push(metadataResult);
		}

		if (processCount === dataSources.length) {
			console.log('---------------- ----------- ----------------------------------------');

			console.log(dataSources.length + ' meta data items collected');
			console.log('');

			harvestFinishCallback(metadataResultList);
		}
	}

	function nutsSortFunction(x) {
		counts[x] = (counts[x] || 0) + 1;
	}

	dataSources.sort(function (a, b) {
		if (a.nuts !== b.nuts) {
			if (a.nuts === '') {
				return 1;
			}
			if (b.nuts === '') {
				return -1;
			}
			return (a.nuts < b.nuts) ? -1 : 1;
		}
		if (a.name === b.name) {
			return 0;
		}
		return (a.name > b.name) ? -1 : 1;
	});

	console.log('NUTS region      Update      Name');
	console.log('---------------- ----------- ----------------------------------------');

	for (i = 0; i < dataSources.length; ++i) {
		txt = '';

		txt += dataSources[i].nuts;
		for (j = dataSources[i].nuts.length; j < 17; ++j) {
			txt += ' ';
		}

		dataData = 'ERROR';
		name = dataSources[i].name;

		if ((typeof dataSources[i].meta === 'undefined') || (dataSources[i].meta === null)) {
			dataData = 'no metadata';

			txt += dataData;
			for (j = ('&' === dataData.substr(0, 1) ? 1 : dataData.length); j < 12; ++j) {
				txt += ' ';
			}

			txt += name.substr(0, 40);
			console.log(txt);

			finishCallback(null);
		} else {
			uri = dataSources[i].meta;
			if ('/' === uri.substr(0, 1)) {
				uri = './data' + uri;
			}

			counts = {};
			nutsList.push(dataSources[i].nuts);
			nutsList.forEach(nutsSortFunction);

			file.download(uri, dataSources[i].nuts + '_' + String.fromCharCode(96 + counts[dataSources[i].nuts]), 'metadata', function (path, userData) {
				file.loadJSON(path, function (json, dataSource) {
					if (json === null) {
						result = {error: true, errorMsg: 'Could not download metadata'};
					} else {
						var metadata = require('./lib/metadata');

//						result = metadata.parse(rawData, json);
						result = metadata.parse('', json);
					}

					result.sourceId = dataSource;

					txt = '';
					txt += dataSources[dataSource].nuts;
					for (j = dataSources[dataSource].nuts.length; j < 17; ++j) {
						txt += ' ';
					}
					dataData = 'ERROR';
					name = dataSources[dataSource].name;

					if (result.error) {
						if ('-' === result.errorMsg) {
							dataData = 'no data';
						} else {
							name += "\n" + '                             ' + result.errorMsg;
						}
					} else {
						if (1 === result.modDays) {
							dataData = result.modDays + ' day';
						} else {
							dataData = result.modDays + ' days';
						}
					}

					txt += dataData;
					for (j = ('&' === dataData.substr(0, 1) ? 1 : dataData.length); j < 12; ++j) {
						txt += ' ';
					}

					txt += name;
					console.log(txt);

					finishCallback(result.error ? null : result);
				}, userData);
			}, i);
		}
	}
}

//-----------------------------------------------------------------------

function harvestDatasetBySource(harvest, source) {
	'use strict';

	var txt, nuts, nutsVec, idx, name, url, path, num, j, file, zip, info, number,
		fs = require('fs');

	console.log('Number Copy from                      To local path');
	console.log('------ ------------------------------ ----------------------------------------');

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

		num = (idx + 1).toString();
		txt += num;
		for (j = num.length; j < 7; ++j) {
			txt += ' ';
		}

		txt += name.substr(0, 30) + ' ';
		for (j = name.length; j < 30; ++j) {
			txt += ' ';
		}

		if ('' === path) {
			txt += '[ignore path]';
		} else {
			file = './harvest';
			if (!fs.existsSync(file)) {
				fs.mkdirSync(file);
			}
			file += '/' + nutsVec[idx].substr(0, 2);
			if (!fs.existsSync(file)) {
				fs.mkdirSync(file);
			}
			file += '/' + nutsVec[idx];
			if (!fs.existsSync(file)) {
				fs.mkdirSync(file);
			}

			path = 'harvest/' + nutsVec[idx].substr(0, 2) + '/' + nutsVec[idx] + '/' + path;
			txt += path;

			if (!copy(url, './' + path)) {
				txt += '[failed to download file]';
			} else {
				harvest.vecDownload.push(path);

				if ('.zip' === path.substr(-4)) {
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
				}
			}
		}
		console.log(txt);
	}

	console.log('------ ------------------------------ ----------------------------------------');

//	$HarvestMetadata->save();
}

//-----------------------------------------------------------------------

function harvestDatasets(dataSources, metadataResultList) {
	'use strict';

	var txt, i, harvest, source;

	console.log('Update source data');
	console.log('==================');
	console.log('');

	for (i = 0; i < metadataResultList.length; ++i) {
		harvest = metadataResultList[i];
		source = dataSources[harvest.sourceId];

		if ('DEA22' === source.nuts) {
//			console.log('Name:    ' + nutsGetName( source.nuts)['en-US']);
			console.log('NUTS:    ' + source.nuts);
			if (typeof source.nutsVec === 'undefined') {
				txt = '         ';
/*				foreach( array_unique( source.nutsVec) as nuts) {
					txt += nuts + ' ';
				}*/
				console.log(txt);
			}
			console.log('Comment: ' + source.name);
			txt = 'Update:  available since ' + harvest.modDays;
			if (1 === harvest.modDays) {
				txt += ' day';
			} else {
				txt += ' days';
			}
			console.log(txt);
			console.log();

			harvestDatasetBySource(harvest, source);
			break;
		}
	}
}

//-----------------------------------------------------------------------

function start() {
	'use strict';

	var file = require('./lib/file');
	file.loadJSON('./data/sources.json', function (dataSources) {
		harvestMetadata(dataSources, function (metadataResultList) {
			harvestDatasets(dataSources, metadataResultList);
		});
	});
}

//-----------------------------------------------------------------------

try {
	console.log();

	start();
} catch (e) {
	console.error(e);
}

//-----------------------------------------------------------------------
//eof
