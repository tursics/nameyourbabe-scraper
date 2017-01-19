/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	accept: function (contents, json) {
		'use strict';

console.log(json.length);
		return (0 === json.length) && (-1 !== contents.indexOf('arnsberg.de'));
	},

	//-------------------------------------------------------------------

	parse: function (contents, json) {
		'use strict';

		var ret = require('./metadata-result').copy(),
			baseClass = require('./metadata-template'),
			i,
			citation = '';

		ret.modified = baseClass.strtotimeLoc(json.metadata_modified);
		ret.modDays = parseInt((Date.now() - ret.modified) / 1000 / 60 / 60 / 24, 10);
		ret.vecURL = [];
		ret.vecName = [];
		ret.vecFormat = [];

		for (i = 0; i < json.resources.length; ++i) {
			ret.vecURL.push(json.resources[i].url);
			ret.vecName.push(json.resources[i].name);
			ret.vecFormat.push(json.resources[i].format);
		}

		if (json.extras && json.extras.license_citation) {
			citation = json.extras.license_citation;
		} else if (json.author && ('' !== json.author)) {
			citation = json.author;
		} else if (json.maintainer && ('' !== json.maintainer)) {
			citation = json.maintainer;
		}

		ret = baseClass.parseCopyright(ret, json.license_title, json.license_url, citation);

		ret.error = false;
		ret.errorMsg = '';

		return ret;

		ret = require('./metadata-result').copy();
		ret.errorMsg = 'Could not parse metadata of Arnsberg';

		posContent = strpos( contents, '<td><a href="/open-data/bevoelkerung/vornamen');
		posSidebar = strpos( contents, '</tr>', posContent);
		strContent = substr( contents, posContent, posSidebar - posContent);

		$posName = strpos( strContent, '>', strpos( strContent, '<a')) + 1;

		if( false === $posName) {
			return ret;
		}

		$strName = substr( strContent, $posName, strpos( strContent, '</a>', $posName) - $posName);

		$strLicUrl = 'https://www.govdata.de/dl-de/zero-2-0';
		$strLicName = 'Datenlizenz Deutschland – Zero – Version 2.0';

		posModified = strpos( strContent, '<td>', strpos( strContent, '<td>', $posName) + 1);
		strModified = substr( strContent, posModified + 4, strpos( strContent, '</td>', posModified) - posModified);

		$d = substr( strModified, 0, 2);
		$m = substr( strModified, 3, 2);
		$y = substr( strModified, 6, 4);
		strModified = $y + '-' + $m + '-' + $d;

		ret.modified = strtotime( strModified);
		ret.modDays = intval(( strtotime( 'now') - ret.modified) /60 /60 /24);
		ret.vecURL = Array();
		ret.vecName = Array();
		posUrl = 0;

		posUrl = strpos( strContent, 'href="', posUrl) + strlen( 'href="');
		strUrl = substr( strContent, posUrl, strpos( strContent, '"', posUrl) - posUrl);
		strUrl = 'http://www.arnsberg.de' . strUrl;

		ret.vecURL.push(strUrl);
		ret.vecName.push('');

		this.parseCopyright( ret, $strLicName, $strLicUrl, '');

		ret.error = false;
		ret.errorMsg = '';

		return ret;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
