/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	accept: function (contents, json) {
		'use strict';

		return false;
//		return json.extras.schema_name === 'OGD Austria Metadaten 1.1';
	},

	//-------------------------------------------------------------------

	parse: function (contents, json) {
		'use strict';

		var ret = require('./metadata-result').copy(),
			baseClass = require('./metadata-template'),
			i;

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

		ret = baseClass.parseCopyright(ret, json.license_title, json.license_url, (json.extras || {license_citation: json.author}).license_citation);

		ret.error = false;
		ret.errorMsg = '';

		return ret;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
