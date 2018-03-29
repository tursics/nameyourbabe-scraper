/*jslint browser: true*/
/*global require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	getName: function () {
		'use strict';

		// AutiSta used in Berlin, Bonn, Chemnitz, Hamburg, Moers, Ulm ...
		return 'AutiSta';
	},

	//-------------------------------------------------------------------

	accept: function (vec, vecCount) {
		'use strict';

		var column0 = ['vorname', 'vornamen'];

//		return (vecCount > 0) && (vec[0][1] === 'anzahl') && (trim( vec[0][2]) === 'geschlecht');
		return ((vecCount > 0) && (-1 !== column0.indexOf(vec[0][0])) && (vec[0][1] === 'anzahl') && (vec[0][2] === 'geschlecht'))
			|| ((vecCount > 0) && (vec[0][0] === 'anzahl') && (-1 !== column0.indexOf(vec[0][1])) && (vec[0][2] === 'geschlecht'));
	},

	//-------------------------------------------------------------------

	parse: function (vec, vecCount, nuts, url, title, echoDataErrors, addNames, finishCallback) {
		'use strict';

		var ret = require('./givenname-result').copy(),
			normalize = require('./givenname-normalize'),
			baseClass = require('./givenname-template'),
			colName = 0,
			colSex = 2,
//			colYear = -1,
//			colPos = -1,
			colCount = 1,
			startRow = 0,
			yearPos = {m: 1, w: 1},
			posCounter = {m: 1, w: 1},
			oldCount = {m: 0, w: 0},
			theYear,
			yearVec,
			lastYear,
			pos,
			row,
			sex,
			name,
			realName,
			voidNames = '';

		if (vec[0][0] === 'anzahl') {
			colCount = 0;
			colName = 1;
		}

		theYear = 2012; // berlin missing year number in 2012
		if (-1 !== title.indexOf('_0.')) {
			pos = title.indexOf('_0.');
			title = title.substr(0, pos) + title.substr(pos + 2);
		} else if (-1 !== title.indexOf('_1.')) {
			pos = title.indexOf('_1.');
			title = title.substr(0, pos) + title.substr(pos + 2);
		} else if (-1 !== title.indexOf('_2.')) {
			pos = title.indexOf('_2.');
			title = title.substr(0, pos) + title.substr(pos + 2);
		}
		yearVec = title.match(/\d+/gi);
		if (yearVec && (0 < yearVec.length)) {
			lastYear = yearVec[yearVec.length - 1];
			lastYear = parseInt(lastYear.substr(-4), 10);
			if ((1900 < lastYear) && (lastYear < 2100)) {
				theYear = lastYear;
			} else if ((10 < lastYear) && (lastYear < 100)) {
				// Moers use 2 digits for the year 2014
				theYear = 2000 + lastYear;
			}
		}

		vecCount = vec.length;
		if (vecCount < 2) {
			ret.errorMsg = 'Unknown AutiSta format!';
			finishCallback(ret);
		}

		ret.data = [];
		ret.error = false;
		ret.errorMsg = '';

		for (row = startRow + 1; row < vecCount; ++row) {
			if (vec[row].length > 1) {
				sex = vec[row][colSex].trim();
				if (oldCount[sex] !== parseInt(vec[row][colCount], 10)) {
					oldCount[sex] = parseInt(vec[row][colCount], 10);
					yearPos[sex] = posCounter[sex];
				}

				name = vec[row][colName].trim();
				realName = normalize.get(name);
				if ('' === realName) {
					voidNames += ('' === voidNames ? '' : ', ') + name;
				}

				if ('' !== realName) {
					ret.data.push({
						name: realName,
						male: sex === 'm' ? true : false,
						year: theYear,
						pos: yearPos[sex],
						number: vec[row][colCount],
						error: ''
					});
				}

				++posCounter[sex];
			}
		}

		if ('' !== voidNames) {
//			ret.error = true;
			ret.errorMsg = 'ignore name ' + voidNames;
		}

		ret.dataCount += ret.data.length;

		baseClass.saveData(ret.data, ret.file, ret.checksum, ret.years, nuts, function () {
			ret.data = [];
			finishCallback(ret);
		});
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
