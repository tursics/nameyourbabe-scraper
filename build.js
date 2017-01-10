/*jslint browser: true*/
/*global console,require*/

//-----------------------------------------------------------------------

function start() {
	'use strict';

	require('./lib/file').loadJSON('./data/sources.json', null, function (dataSources) {
		require('./lib/harvest-metadata').harvest(dataSources, function (metadataResultList) {
			require('./lib/harvest-dataset').harvest(dataSources, metadataResultList, function (datasetResultList) {
				require('./lib/harvest-givenname').harvest(datasetResultList, function () {
//					console.log('> finished <');
				});
			});
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
