/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	saveDataset: function (url, filePath, harvestInfo, idx, harvestFinishCallback) {
		'use strict';

		var vec, vecCount,
			fs = require('fs'),
			csv = require('csvtojson'),
			file = require('./file'),
			txt = '',
			nuts = harvestInfo.cachePath.substr(0, harvestInfo.cachePath.indexOf('_')),
			j,
			num;

		function finishCallback(result, txt) {
			console.log(txt);

			harvestFinishCallback(result);
		}

		txt += nuts;
		for (j = nuts.length; j < 17; ++j) {
			txt += ' ';
		}

		num = (idx + 1).toString() + '/' + (harvestInfo.vecURL.length).toString();
		txt += num;
		for (j = num.length; j < 7; ++j) {
			txt += ' ';
		}

		if ('.pdf' === url.substr(-4)) {
			txt += 'ignore PDF file';
			finishCallback(null, txt);
			return;
		} else if ('.zip' === url.substr(-4)) {
			txt += 'ignore ZIP file';
			finishCallback(null, txt);
			return;
		} else if ('.txt' === url.substr(-4)) {
			txt += 'ignore TXT file';
			finishCallback(null, txt);
			return;
		} else if ('.json' === url.substr(-5)) {
			txt += 'ignore JSON file';
			finishCallback(null, txt);
			return;
		} else if (('.xlsx' === url.substr(-5)) || ('.xls' === url.substr(-4))) {
			txt += 'ignore Excel file';
			finishCallback(null, txt);
			return;
		}

		vec = [];

		csv({noheader: true, delimiter: 'auto'})
			.fromFile(url)
			.on('csv', function (csvRow) {
				vec.push(csvRow);
			})
			.on('error', function (csvRow) {
				vec = [];
			})
			.on('done', function (error) {
				vecCount = vec.length;

				var givenname = require('./givenname');

				givenname.parse(vec, vecCount, nuts, url, true, function (result) {
					if (result.error) {
						txt += 'error: ' + result.errorMsg + ', ';
						txt += 'used parser: ' + givenname.getParserClass(vec, vecCount);

						finishCallback(result, txt);
					} else {
						txt += result.dataCount + ' names saved in ' + result.file.length + ' files';
						if (result.errorMsg !== '') {
							txt += ', ' + result.errorMsg;
						}

						finishCallback(result, txt);
					}
				});
			});
	},

	//-------------------------------------------------------------------

	saveMetadata: function (harvestInfo, userData, harvestFinishCallback) {
		'use strict';

		var filePath, nuts, metadata,
			fs = require('fs'),
			file = require('./file');

		nuts = harvestInfo.cachePath;
		nuts = nuts.substr(0, nuts.indexOf('_'));

		filePath = './harvest';
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}
		filePath += '/' + nuts.substr(0, 2);
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}
		filePath += '/' + nuts.substr(0, 3);
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}
		filePath += '/' + nuts;
		if (!fs.existsSync(filePath)) {
			fs.mkdirSync(filePath);
		}

		metadata = {
			nuts: nuts,
			license: harvestInfo.license,
			citation: harvestInfo.citation,
			modified: (new Date(harvestInfo.modified)).toJSON()
		};

		fs.writeFile(filePath + '/metadata.json', JSON.stringify(metadata), function (err) {
			if (err) {
				return console.log(err);
			}
			harvestFinishCallback(filePath, userData);
		});
	},

	//-------------------------------------------------------------------

	harvest: function (fileList, harvestFinishCallback) {
		'use strict';

		var i, j, harvestInfo, url,
			datasetResultList = [],
			downloadLinks = 0,
			processedCount = 0,
			fileCount = 0;

		function finishCallback(harvestResult) {
			++processedCount;

			if (harvestResult) {
				fileCount += harvestResult.file.length;
			}

			if (processedCount === downloadLinks) {
				console.log('---------------- ------ ---------------------------------------------');
				console.log((fileCount / 2) + ' given name year sets collected');
				console.log('');

				harvestFinishCallback(datasetResultList);
			}
		}

		console.log('NUTS region      Number Message');
		console.log('---------------- ------ ---------------------------------------------');

		fileList.sort(function (a, b) {
			return (a.cachePath < b.cachePath) ? -1 : 1;
		});

		for (i = 0; i < fileList.length; ++i) {
			harvestInfo = fileList[i];
			downloadLinks += harvestInfo.vecDownload.length;
		}

		for (i = 0; i < fileList.length; ++i) {
			harvestInfo = fileList[i];

			this.saveMetadata(harvestInfo, {that: this, harvestInfo: harvestInfo}, function (filePath, userData) {
				var that = userData.that,
					harvestInfo = userData.harvestInfo;

				for (j = 0; j < harvestInfo.vecDownload.length; ++j) {
					url = harvestInfo.vecDownload[j];
					if (url && ('' !== url)) {
						that.saveDataset(url, filePath, harvestInfo, j, function (harvestResult) {
							finishCallback(harvestResult);
						});
					} else {
						finishCallback(null);
					}
				}
			});
		}
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
