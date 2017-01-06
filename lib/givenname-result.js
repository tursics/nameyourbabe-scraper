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
