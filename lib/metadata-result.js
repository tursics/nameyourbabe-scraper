/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	error: true,
	errorMsg: 'not parsed',
	modified: 0,
	modDays: 0,
	vecURL: null,
	vecName: null,
	license: '',
	citation: '',
	sourceId: null,

	//-------------------------------------------------------------------

	copy: function () {
		'use strict';

		var copy = this.constructor(),
			attr;

		for (attr in this) {
			if (this.hasOwnProperty(attr)) {
				copy[attr] = this[attr];
			}
		}
		return copy;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
