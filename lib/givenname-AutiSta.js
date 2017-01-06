/*jslint browser: true*/
/*global console,require,module*/

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

//		return (vecCount > 0) && (vec[0][1] === 'anzahl') && (trim( vec[0][2]) === 'geschlecht');
		return (vecCount > 0) && (vec[0][0] === 'vorname') && (vec[0][1] === 'anzahl') && (vec[0][2] === 'geschlecht');
	},

	//-------------------------------------------------------------------

	parse: function (vec, vecCount, nuts, url, echoDataErrors, addNames) {
		'use strict';

		var ret = require('./givenname-result').copy(),
			normalize = require('./givenname-normalize'),
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
			return ret;
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
					voidNames = '' === voidNames ? name : ', ' + name;
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
			ret.error = true;
			ret.errorMsg = 'Ignored name: "' + voidNames + '"';
		}

/*		if( $addNames) {
			global $HarvestNames;

			$this->parseDataAddNames( ret.data);
			$HarvestNames->save();
		} else {
			$this->parseData( ret.data);
			if( !$this->echoDataErrors( ret.data, $echoDataErrors)) {
				ret.error = true;
				ret.errorMsg = 'Unknown names found. No files saved!';
			}
			ret.dataCount += count( ret.data);

			if( !ret.error) {
				$this->saveData( ret.data, ret.file, ret.checksum, ret.years, $nuts);
			}
			ret.data = Array();
		}*/

		return ret;
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
