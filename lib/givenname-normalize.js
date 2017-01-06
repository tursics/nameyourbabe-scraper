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
			'noch', 'kein', 'Vorname',
			'ohne', 'Vornamen',
			'keinen',
			'(Eigenname)', 'Eigenname:', 
			'(Vorname', '(Vorname)', '(Vornamen',
			'(Vor-', 'und', 'Vatersname)', 
			'(Vatersname)', 'Vatersname:', 
			'(Großvatersname)', 'Mittelname)', '(Mittelname)', 
			'Namen', 
			'Totgeborener',
			'Jr.', 'A.', 'C.', '.', 
			'al', 'da', 'de', 'del', 'Del', 'don',
			'oglu', 'oğlu', 'ogly', 'kyzy', 'qizi', 'qızı', 
			'\'evna', 'Jose\''
		];

		name = name.normalize('NFC');
		if (-1 !== avoid.indexOf(name)) {
			return '';
		}

		if (name === 'Nana-akua') {
			return 'Nana-Akua';
		} else if (name === 'Shawn,') {
			return 'Shawn';
		} else if (name === 'ClaudiaRicarda') {
			return 'Claudia-Ricarda';
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

		return name;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
