/*jslint browser: true*/
/*global require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	accept: function (contents, json) {
		'use strict';

		return (typeof json.extras !== 'undefined') && (typeof json.extras.sector !== 'undefined') && (json.extras.sector === 'oeffentlich');
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
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
