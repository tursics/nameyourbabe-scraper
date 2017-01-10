/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------
	// http://www.bmi.bund.de/SharedDocs/Standardartikel/DE/Themen/MigrationIntegration/ohneMarginalspalte/Familiennamen_des_Kindes_nach.html
	//
	// Aserbaidschan
	// "ogly" (Sohn von) bzw. "kyzy" (Tochter von)
	//-------------------------------------------------------------------

	get: function (name) {
		'use strict';

		var avoid = [
			'noch', 'kein', 'keinen', 'ohne',
			'(Vor-', 'und', 'Namen',
			'Totgeborener',
			'al', 'da', 'de', 'del', 'Del', 'don',
			'oglu', 'oğlu', 'ogly', 'kyzy', 'qizi', 'qızı',
			'\'evna', 'Jose\''
		],
			allowed = ['Anamelle', 'Osaruonamen'];

		name = name.normalize('NFC');
		if (-1 !== avoid.indexOf(name)) {
			return '';
		}
		if (-1 !== allowed.indexOf(name)) {
			// given name contains 'name'
			return name;
		}

		if (name === 'Nana-akua') {
			return 'Nana-Akua';
		} else if (name === 'Shawn,') {
			return 'Shawn';
		} else if (name === 'ClaudiaRicarda') {
			return 'Claudia-Ricarda';
		} else if (name === 'LETIZIA') {
			return 'Letizia';
		} else if (name === 'Mariam-chantel') {
			return 'Mariam-Chantel';
		} else if (name === 'LouAnn') { // correct name
			return 'Lou-Ann';
		} else if (name === 'kim') {
			// ????
			return 'Kim';
		} else if (name === 'gizi') {
			// ????
			return 'Gizi';
		} else if (name === 'mia') {
			// ????
			return '';
//			return 'Mia';
		}

		if (-1 !== name.indexOf('name')) {
			// placeholder
			return '';
		}

		if (-1 !== name.indexOf('.')) {
			// abbreviation
			return '';
		}

		return name;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
