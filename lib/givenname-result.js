/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	error: true,
	errorMsg: 'not parsed',
	data: [],
	dataCount: 0,
	file: [],
	checksum: [],
	years: [],

	//-------------------------------------------------------------------

	copy: function () {
		'use strict';

		var copy = this.constructor(),
			attr,
			i,
			len;

		for (attr in this) {
			// Handle Array
			if (this[attr] instanceof Array) {
				copy[attr] = [];
				for (i = 0, len = this[attr].length; i < len; ++i) {
					copy[attr][i] = this[attr][i];
				}
			} else if (this.hasOwnProperty(attr)) {
				copy[attr] = this[attr];
			}
		}
		return copy;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
