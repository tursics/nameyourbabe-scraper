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

		function finishCallback(txt) {
			console.log(txt);

			harvestFinishCallback(null);
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
			finishCallback(txt);
			return;
		} else if ('.zip' === url.substr(-4)) {
			txt += 'ignore ZIP file';
			finishCallback(txt);
			return;
		} else if ('.txt' === url.substr(-4)) {
			txt += 'ignore TXT file';
			finishCallback(txt);
			return;
		} else if ('.json' === url.substr(-5)) {
			txt += 'ignore JSON file';
			finishCallback(txt);
			return;
		} else if (('.xlsx' === url.substr(-5)) || ('.xls' === url.substr(-4))) {
			txt += 'ignore Excel file';
			finishCallback(txt);
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

				var givenname = require('./givenname'),
					result;

				result = givenname.parse(vec, vecCount, harvestInfo.nuts, url, true);

				if (result.error) {
					txt += 'error: ' + result.errorMsg + ', ';
					txt += 'used parser: ' + givenname.getParserClass(vec, vecCount);

					finishCallback(txt);
				} else {
/*			$dataCount = result.dataCount;
			for( $it = 0; $it < $dataCount; ++$it) {
				$item = result.data[ $it];
				if( '' != $item['error']) {
					// I got out of memory errors for Zurich data
//					txt += $item['error'] + ' (#' + $item['pos'] + ' ' + ($item['male']?'male':'female') + ' in ' + $item['year'] + ')' + '<br>';
					txt = ' ';
					echo $item['error'].' (#' . $item['pos'] . ' '.($item['male']?'male':'female').' in ' . $item['year'] . ')'.'<br>';
				}
			}
			if( 0 == strlen( txt)) {
				if( $doUpdate) {
					txt += $dataCount + ' entries saved in ' + count( result.file) + ' files<br>';
					if( 0 < count( result.years)) {
						if( 0 < count( $harvest['years'])) {
							$harvest['years'] = array_unique( array_merge( $harvest['years'], result.years));
						} else {
							$harvest['years'] = array_unique( result.years);
						}
					}
				} else {
					txt += 'New names are saved<br>';
				}
			} else {
				txt += $dataCount + ' entries collected but error found. No files saved!<br>';
				$txt += 'Used parser: ' + givenname.getParserClass(vec, vecCount) + '<br>';
				$ret = 'error';
			}

//			$lastMod = strtotime( $harvest['modified']);
//			$diffMod = intval(( result.modified - $lastMod) /60 /60 /24);
//
//			if( 0 >= $diffMod) {
//				$dataData = '&radic;'.' Last mod: '.$lastMod;
//				$harvest['update'] = 0;
//			} else {
//				if( 1 == result.modDays) {
//					$dataData = result.modDays.' day';
//				} else {
//					$dataData = result.modDays.' days';
//				}
//				$harvest['name'] = result.vecName;
//				$harvest['url'] = result.vecURL;
//				$harvest['license'] = result.license;
//				$harvest['citation'] = result.citation;
//				$harvest['update'] = result.modDays;
//				if( 0 == $harvest['update']) {
//					$harvest['update'] = 1;
//				}
//			}
			console.log(txt);*/

					finishCallback(txt);
				}
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
			processedCount = 0;

		function finishCallback(harvestResult) {
			++processedCount;
//			datasetResultList.push(harvestResult);

			if (processedCount === downloadLinks) {
				console.log('---------------- ------ ---------------------------------------------');
				console.log((datasetResultList.length / 2) + ' given name sets collected');
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
