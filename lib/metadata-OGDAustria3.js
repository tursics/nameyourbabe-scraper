/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	accept: function (contents, json) {
		'use strict';

		return json.success === true;
	},

	//-------------------------------------------------------------------

	parse: function (contents, json) {
		'use strict';

		var baseClass = require('./metadata-OGDAustria1-1');

		if (1 === json.result.length) {
			return baseClass.parse(contents, json.result[0]);
		}
		return baseClass.parse(contents, json.result);
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
