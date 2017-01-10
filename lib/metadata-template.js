/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	accept: function (contents, json) {
		'use strict';

		return false;
	},

	//-------------------------------------------------------------------

	parse: function (contents, json) {
		'use strict';

		var ret = require('./metadata-result').copy();
		return ret;
	},

	//-------------------------------------------------------------------

	parseCopyright: function (ret, title, url, citation) {
		'use strict';

		title = title.trim();

		if (('Creative Commons Namensnennung 3.0 Österreich' === title) && ('https://creativecommons.org/licenses/by/3.0/at/deed.de' === url)) {
			ret.license = 'CC BY 3.0 AT';
		} else if (('Creative Commons Namensnennung (CC-BY)' === title) && ('http://www.opendefinition.org/licenses/cc-by' === url)) {
			ret.license = 'CC BY';
		} else if (('Creative Commons Namensnennung' === title) && ('http://creativecommons.org/licenses/by/3.0/de/' === url)) {
			ret.license = 'CC BY 3.0 DE';
		} else if (('Creative Commons CCZero' === title) && ('http://www.opendefinition.org/licenses/cc-zero' === url)) {
			ret.license = 'CC 0';
		} else if (('cc-zero' === title) && (typeof url === 'undefined')) {
			ret.license = 'CC 0';
		} else if (('Datenlizenz Deutschland - Namensnennung - Version 1.0' === title) && ('http://www.daten-deutschland.de/bibliothek/Datenlizenz_Deutschland/dl-de-by-1.0' === url)) {
			ret.license = 'DL DE BY 1.0';
		} else if ("Datenlizenz Deutschland \u2013 Namensnennung \u2013 Version 2.0" === title) {
			ret.license = 'DL DE BY 2.0';
		} else if ('Datenlizenz Deutschland Namensnennung 2.0' === title) {
			ret.license = 'DL DE BY 2.0';
		} else if (("Datenlizenz Deutschland \u2013 Zero \u2013 Version 2.0" === title) && ('https://www.govdata.de/dl-de/zero-2-0' === url)) {
			ret.license = 'DL DE 0 2.0';
		} else if ('public' === title) {
			ret.license = 'public';
		} else {
			ret.license = 'unknown';
		}

		if ((typeof citation !== 'undefined') && (0 === citation.indexOf('Datenquelle:'))) {
			ret.citation = citation;
		} else if (('public' === ret.license) && (typeof citation !== 'undefined') && (citation.length > 0)) {
			ret.citation = citation;
		} else if (('CC 0' === ret.license) && (typeof citation !== 'undefined') && (citation.length > 0)) {
			ret.citation = citation;
		} else if (('DL DE BY 2.0' === ret.license) && (typeof citation !== 'undefined') && (citation.length > 0)) {
			ret.citation = citation;
		} else if (('DL DE 0 2.0' === ret.license) && (typeof citation !== 'undefined') && (citation.length > 0)) {
			ret.citation = citation;
		} else {
			ret.citation = '';
		}

		return ret;
	},

	//-------------------------------------------------------------------

	strtotimeLoc: function (dateString) {
		'use strict';

		var ret = Date.parse(dateString);

/*		if (isNaN(ret)) {
			dateString = strtr(strtolower(dateString), array('januar'=>'jan','februar'=>'feb','märz'=>'march','april'=>'apr','mai'=>'may','juni'=>'jun','juli'=>'jul','august'=>'aug','september'=>'sep','oktober'=>'oct','november'=>'nov','dezember'=>'dec'));
			ret = Date.parse( dateString);
			if (isNaN(ret)) {
				dateString = strtr(dateString, array('-'=>''));
				ret = Date.parse(dateString);
			}
		}*/
		return ret;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
