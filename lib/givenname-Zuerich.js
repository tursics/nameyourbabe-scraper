/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	getName: function () {
		'use strict';

		// Used in Zurich
		return 'Zuerich';
	},

	//-------------------------------------------------------------------

	accept: function (vec, vecCount) {
		'use strict';

		return (vecCount > 0) && (vec[0][1] === 'vorname') && (vec[0][2] === 'geschlecht') && (vec[0][3] === 'Anzahl');
	},

	//-------------------------------------------------------------------

	OLDparse: function (vec, vecCount, nuts, url, echoDataErrors, addNames, finishCallback) {
		'use strict';

		var ret = require('./givenname-result').copy(),
			normalize = require('./givenname-normalize'),
			baseClass = require('./givenname-template'),
			colName = 0,
			colSex = 2,
//			colYear = -1,
			colPos = -1,
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
		url = decodeURIComponent(url.substr(0, url.lastIndexOf('-')) + url.substr(url.lastIndexOf('.')));
		if (-1 !== url.indexOf('_0.')) {
			pos = url.indexOf('_0.');
			url = url.substr(0, pos) + url.substr(pos + 2);
		} else if (-1 !== url.indexOf('_1.')) {
			pos = url.indexOf('_1.');
			url = url.substr(0, pos) + url.substr(pos + 2);
		} else if (-1 !== url.indexOf('_2.')) {
			pos = url.indexOf('_2.');
			url = url.substr(0, pos) + url.substr(pos + 2);
		}
		yearVec = url.match(/\d+/gi);
		if (0 < yearVec.length) {
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
	},

	//-------------------------------------------------------------------

	sortHarvestedData: function (left, right) {
		'use strict';

		if (left.year !== right.year) {
			return (left.year > right.year) ? -1 : 1;
		}
		if (left.male !== right.male) {
			return left.male ? -1 : 1;
		}
		if (left.number === right.number) {
			return 0;
		}
		return (left.number > right.number) ? -1 : 1;
	},

	//-------------------------------------------------------------------

	sortVecFunc: function (left, right) {
		'use strict';

//		colYear = 0;
//		colSex = 2;
//		colCount = 3;

		if ('jahr' === left[0]) {
			return -1;
		} else if ('jahr' === right[0]) {
			return 1;
		}

		if (left[0] !== right[0]) {
			return (left[0] > right[0]) ? -1 : 1;
		}
		if (left[2] !== right[2]) {
			return (left[2] > right[2]) ? -1 : 1;
		}
		if (left[3] === right[3]) {
			return 0;
		}
		return (left[3] > right[3]) ? -1 : 1;
	},

	//-------------------------------------------------------------------

	parse: function (vec, vecCount, nuts, url, echoDataErrors, addNames, finishCallback) {
		'use strict';

		var ret = require('./givenname-result').copy(),
			normalize = require('./givenname-normalize'),
			baseClass = require('./givenname-template'),
			colName = 1,
			colSex = 2,
			colYear = 0,
//			colPos = -1,
			colCount = 3,
			startRow = 1,
			lastYear,
			row,
			name,
			realName,
			voidNames = '',
			that = this;

console.log('start');
		function finishYear(ret) {
			if ('' !== voidNames) {
//				ret.error = true;
				ret.errorMsg += 'ignore name ' + voidNames;
			}

			if (ret.data.length > 0) {
				that.generateDataPos(ret.data);
			}

			ret.dataCount += ret.data.length;

			var retcopy = ret.copy();
console.log('data: ' + ret.data.length + ' (year ' + lastYear + ')');
			if (ret.data.length > 0) {
				ret.data = [];
				ret.errorMsg = '';
				baseClass.saveData(retcopy.data, ret.file, ret.checksum, ret.years, nuts, function () {
//					ret.data = [];
//					ret.errorMsg = '';
					finishCallback(ret);
				});
			} else {
				finishCallback(ret);
			}
		}

		vecCount = vec.length;
		if (vecCount < 2) {
			ret.errorMsg = 'Unknown Zurich format!';
			finishCallback(ret);
		}

		for (row = startRow; row < vecCount; ++row) {
			if (vec[row].length >= 3) {
				vec[row][colYear] = parseInt(vec[row][colYear], 10);
				vec[row][colCount] = parseInt(vec[row][colCount], 10);
			}
		}

		vec.sort(this.sortVecFunc);

		ret.data = [];
		ret.error = false;
		ret.errorMsg = '';

		lastYear = 0;
		for (row = startRow; row < vecCount; ++row) {
			if (vec[row].length > 1) {
				if (lastYear !== vec[row][colYear]) {
					lastYear = vec[row][colYear];

					finishYear(ret);
				}

				name = vec[row][colName].trim();
				realName = normalize.get(name);
				if ('' === realName) {
					voidNames += ('' === voidNames ? '' : ', ') + name;
				}

				if ('' !== realName) {
					ret.data.push({
						name: realName,
						male: vec[row][colSex] === '"weiblich"' ? false : true,
						year: vec[row][colYear],
						pos: 0,
						number: vec[row][colCount],
						error: ''
					});
				}
			}
		}

		finishYear(ret);
	},

	//-------------------------------------------------------------------

	generateDataPos: function (/*&*/ data) {
		'use strict';

		var dataCount, currentPos, currentNumber, currentMale, yearPos, row;

		data.sort(this.sortHarvestedData);

		dataCount = data.length;
		currentPos = 0;
		currentNumber = 0;
		currentMale = true;
		yearPos = 1;

		for (row = 0; row < dataCount; ++row, ++yearPos) {
			if (currentMale !== data[row].male) {
				currentMale = data[row].male;
				yearPos = 1;
			}
			if (currentNumber !== data[row].number) {
				currentNumber = data[row].number;
				currentPos = yearPos;
			}
			data[row].pos = currentPos;
		}
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
