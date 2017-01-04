/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	harvest: function (dataSources, harvestFinishCallback) {
		'use strict';

		var file = require('./file'),
			i,
			j,
			txt,
			dataData,
			name,
			uri,
			cachePathName,
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
			return (a.name < b.name) ? -1 : 1;
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

				cachePathName = dataSources[i].nuts + '_' + String.fromCharCode(96 + counts[dataSources[i].nuts]);

				file.download(uri, cachePathName, 'metadata', 'json', {i: i, cachePathName: cachePathName}, function (path, userData) {
					file.loadJSON(path, userData, function (json, dataSource) {
						if (json === null) {
							result = {error: true, errorMsg: 'Could not download metadata'};
						} else {
							var metadata = require('./metadata');

	//						result = metadata.parse(rawData, json);
							result = metadata.parse('', json);
						}

						result.sourceId = dataSource.i;
						result.cachePath = dataSource.cachePathName;

						txt = '';
						txt += dataSources[dataSource.i].nuts;
						for (j = dataSources[dataSource.i].nuts.length; j < 17; ++j) {
							txt += ' ';
						}
						dataData = 'ERROR';
						name = dataSources[dataSource.i].name;

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
					});
				});
			}
		}
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
