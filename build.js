/*jslint browser: true*/
/*global console,require*/

//-----------------------------------------------------------------------

function harvestMetadata(dataSources, dataHarvestMetadata) {
	'use strict';

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

	var file = require('./lib/file'),
		i,
		j,
		harvest,
		txt,
		dataData,
		name,
		uri,
		result;

	console.log('NUTS region      Update      Name');
	console.log('---------------- ----------- ----------------------------------------');

	for (i = 0; i < dataSources.length; ++i) {
		txt = '';

		if (-1 !== dataHarvestMetadata.indexOf(dataSources[i].meta)) {
			harvest = dataHarvestMetadata[dataHarvestMetadata.indexOf(dataSources[i].meta)];
		} else {
			harvest = {
				name: [],
				url: [],
				license: '',
				citation: '',
				modified: '2000-01-01',
				update: -1
			};
		}

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
		} else {
			uri = dataSources[i].meta;
			if ('/' === uri.substr(0, 1)) {
				uri = './data' + uri;
			}

			file.download(uri, dataSources[i].nuts, 'metadata', function (path, userData) {
				file.loadJSON(path, function (json, dataSource) {
					if (json === null) {
						result = {error: true, errorMsg: 'Could not download metadata'};
					} else {
//						result = $HarvestMetadata->parse( contents, $json);
						result = {error: true, errorMsg: 'TODO: download and parse metadata'};
					}
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
						harvest.update = -1;
					} else {
						var lastMod = strtotime( harvest.modified);
						var diffMod = intval(( result.modified - lastMod) / 60 / 60 / 24);

						if (0 >= diffMod) {
							dataData = '&radic;' + ' Last mod: ' + $lastMod;
							harvest.update = 0;
						} else {
							if (1 === result.modDays) {
								dataData = result.modDays + ' day';
							} else {
								dataData = result.modDays + ' days';
							}
							harvest.name = result.vecName;
							harvest.url = result.vecURL;
							harvest.license = result.license;
							harvest.citation = result.citation;
							harvest.update = result.modDays;
							if( 0 === $harvest.update) {
								$harvest.update = 1;
							}
						}
					}

//					$dataHarvestMetadata[ $MetadataVec[$i]['meta']] = $harvest;

					txt += dataData;
					for( j = ('&' === dataData.substr(0, 1) ? 1 : dataData.length); j < 12; ++j) txt += ' ';

					txt += name;
					console.log( txt);
				}, userData);
			}, i);
		}
	}

	console.log('---------------- ----------- ----------------------------------------');
	console.log('');

//	$HarvestMetadata->save();

	console.log(dataSources.length + ' meta data items collected');
}

//-----------------------------------------------------------------------

function start() {
	'use strict';

	var file = require('./lib/file');
	file.loadJSON('./data/sources.json', function (dataSources) {
		file.loadJSON('./harvest/metadata.json', function (dataHarvestMetadata) {
			harvestMetadata(dataSources, dataHarvestMetadata || []);
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
