/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	getName: function () {
		'use strict';

		// AutiSta used in Bremen, Moers, ...
		return 'AutiStaScan';
	},

	//-------------------------------------------------------------------

	accept: function (vec, vecCount) {
		'use strict';

		var column0 = ['vorname', 'vornamen'];

		return (vecCount > 1) && (vec[1][0].trim() === 'Anzahl der Kinder mit');
	},

	//-------------------------------------------------------------------

	parse: function (vec, vecCount, nuts, url, title, echoDataErrors, addNames, finishCallback) {
		'use strict';

		var ret = require('./givenname-result').copy(),
			normalize = require('./givenname-normalize'),
			baseClass = require('./givenname-template'),
//			colName = -1,
			colNameMale = 3,
			colNameFemale = 1,
//			colSex = -1,
//			colYear = 0,
			colPos = 0,
//			colCount = -1,
			colCountMale = 4,
			colCountFemale = 2,
			theYearStr,
			theYear,
			row,
			name,
			realName,
			voidNames = '';

		vecCount = vec.length;
		if (vecCount < 20) {
			ret.errorMsg = 'Unknown AutiStaScan format!';
			finishCallback(ret);
		}

		row = 0;
		if ('Vornamenstatistik' !== vec[row][0].trim().split(' ')[0]) {
			++row;
		}

		theYearStr = vec[row][0].trim();
		theYearStr = theYearStr.substr(-4);
		theYear = parseInt(theYearStr, 10);
		if (theYear < 2000) {
			ret.errorMsg = 'Unknown AutiStaScan year format... ' + theYear + ' != ' + theYearStr;
			finishCallback(ret);
		}

		for (row = row; row < vecCount; ++row) {
/*			if ('' === vec[row][0]) {
				if (row > 3) {
					// Häufigkeit
					if (2 === vec[row + 1][0].indexOf('ufigkeit')) {
						if (228 === vec[row + 1][0][1].ord()) {
							convertVecVecToUTF8(vec);
						}
					}
					break;
				}
			} else*/
			if (-1 !== vec[row][0].indexOf('figkeit der vergebenen Vornamen')) {
				// Häufigkeit | Haeufigkeit
				--row;
				break;
			} else if ('Rang Mädchen Anzahl Knaben Anzahl' === vec[row][0]) {
				row -= 2;
				break;
			} else if ('Rang Mädchen Anzahl Jungen Anzahl' === vec[row][0]) {
				row -= 2;
				break;
			} else if (('Rang' === vec[row][0]) && ('Mädchen' === vec[row][1])) {
				row -= 2;
				break;
			}
		}
		row += 2;

		if (row >= vecCount) {
			ret.errorMsg = 'Unknown AutiStaScan year format (less data)...';
			finishCallback(ret);
		}

		if (1 === vec[row].length) {
			return this.parseFromPDF(vec, vecCount, nuts, url, row, theYear, echoDataErrors, addNames);
		}

		if ('Anzahl' !== vec[row][2].trim()) {
			--row;
			if ('Anzahl' !== vec[row - 1][2].trim()) {
				row += 2;
				if ('Anzahl' !== vec[row][2].trim()) {
					ret.errorMsg = 'Unknown AutiStaScan year format (Anzahl 1)...';
					finishCallback(ret);
				}
			}
		}
		if ('Knaben' !== vec[row][3].trim()) {
			if ('Knaben' !== vec[row - 1][3].trim()) {
				if ('Jungen' !== vec[row][3].trim()) {
					ret.errorMsg = 'Unknown AutiStaScan year format (Knaben)...';
					finishCallback(ret);
				}
			}
		}
		if ('Anzahl' !== vec[row][4].trim()) {
			if ('Anzahl' !== vec[row - 1][4].trim()) {
				ret.errorMsg = 'Unknown AutiStaScan year format (Anzahl 2)...';
				finishCallback(ret);
			}
		}

		++row;

		ret.data = [];
		ret.error = false;
		ret.errorMsg = '';

		for (row = row; row < vecCount; ++row) {
			if (parseInt(vec[row][colPos], 10) < 1) {
				break;
			}
			if (vec[row].length > 1) {
				name = vec[row][colNameMale].trim();
				realName = normalize.get(name);
				if ('' === realName) {
					voidNames += ('' === voidNames ? '' : ', ') + name;
				}

				if ('' !== realName) {
					ret.data.push({
						name: realName,
						male: true,
						year: theYear,
						pos: parseInt(vec[row][colPos], 10),
						number: parseInt(vec[row][colCountMale].trim(), 10),
						error: ''
					});
				}

				name = vec[row][colNameFemale].trim();
				realName = normalize.get(name);
				if ('' === realName) {
					voidNames += ('' === voidNames ? '' : ', ') + name;
				}

				if ('' !== realName) {
					ret.data.push({
						name: realName,
						male: false,
						year: theYear,
						pos: parseInt(vec[row][colPos], 10),
						number: parseInt(vec[row][colCountFemale].trim(), 10),
						error: ''
					});
				}
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

/*	public function parseFromPDF( vec, vecCount, nuts, $url, $row, $theYear, echoDataErrors, addNames)
	{
		// Used in Essen, ...
		$ret = new HarvestDataResult();
		vecCount = count( vec);

		$current = explode( " ", vec[ $row][0]);
		$previous = explode( " ", vec[ $row-1][0]);

		if( 'Anzahl' != trim( $current[2])) {
			--$row;
			if( 'Anzahl' != trim( $previous[2])) {
				$ret->errorMsg = 'Unknown AutiStaScan pdf format (Anzahl 1)...';
				finishCallback(ret);
			}
		}
		if( 'Knaben' != trim( $current[3])) {
			if( 'Knaben' != trim( $previous[3])) {
				if( 'Jungen' != trim( $current[3])) {
					if( 'Jungen' != trim( $previous[3])) {
						$ret->errorMsg = 'Unknown AutiStaScan pdf format (Knaben)...';
						finishCallback(ret);
					}
				}
			}
		}
		if( 'Anzahl' != trim( $current[4])) {
			if( 'Anzahl' != trim( $previous[4])) {
				$ret->errorMsg = 'Unknown AutiStaScan pdf format (Anzahl 2)...';
				finishCallback(ret);
			}
		}

		++$row;

//		colName = -1;
		colNameMale = 3;
		colNameFemale = 1;
//		colSex = -1;
//		colYear = 0;
		colPos = 0;
//		colCount = -1;
		colCountMale = 4;
		colCountFemale = 2;

		$ret->data = Array();
		$ret->error = false;
		$ret->errorMsg = '';

		for( ; $row < vecCount; ++$row) {
			$current = explode( " ", vec[ $row][0]);
			if( intval( $current[colPos]) < 1) {
				continue;
			}
			if( count( $current) > 3) {
				$male = trim( $current[colNameMale]);
				if( 'Tot' == $male) {} else
				if( 'geborener' == $male) {} else
				if( '(Vorname' == $male) {} else
				if( '(Vor' == $male) {} else
				if( 'und' == $male) {} else
				if( 'Vatersname)' == $male) {} else
				if( '(Vatersname)' == $male) {} else
				if( 'noch' == $male) {} else
				if( 'kein' == $male) {} else
				if( 'Vorname' == $male) {} else
				if( 'oğlu' == $male) {} else
				if( 'van' == $male) {} else
				if( 'Alessandro-' == $male) {} else // data corruption
				if( 'Maximilian-' == $male) {} else // data corruption
				if( '1' == $male) {} else // given name is empty, count is '1'
				{
					$ret->data[] = Array(
						name=> $male,
						male=> true,
						year=> $theYear,
						pos=> intval( $current[colPos]),
						number=> trim( $current[colCountMale]),
						error=> '',
					);
				}

				$female = trim( $current[colNameFemale]);
				if(( '' == $female) && ( '' == $current[colCountFemale])) {
					continue;
				}

				if( 'Tot' == $female) {} else
				if( 'geborenes' == $female) {} else
				if( 'Mädchen' == $female) {} else
				if( '(Vorname' == $female) {} else
				if( 'und' == $female) {} else
				if( 'Vatersname)' == $female) {} else
				if( 'Vatersname' == $female) {} else
				if( 'Vatersname:' == $female) {} else
				if( 'Nameskette' == $female) {} else
				if( 'Namenskette' == $female) {} else
				if( '(Namenskette)' == $female) {} else
				if( 'noch' == $female) {} else
				if( 'kein' == $female) {} else
				if( 'Vorname' == $female) {} else
				if( '-Alexandra' == $female) {} else // data corruption
				if( 'Irini-' == $female) {} else // data corruption
				if( 'Jo-Essen' == $female) {} else // found in database from Essen
				if( 'nana' == $female) {} else
				if( 'kyzy' == $female) {} else
				if( 'de' == $female) {} else
				{
					$ret->data[] = Array(
						name=> $female,
						male=> false,
						year=> $theYear,
						pos=> intval( $current[colPos]),
						number=> trim( $current[colCountFemale]),
						error=> '',
					);
				}
			} else if( count( $current) > 1) {
				$female = trim( $current[ 1]);
				if( 'Zwischennamen:' == $female) {} else
				{
					$ret->data[] = Array(
						name=> $female,
						male=> false,
						year=> $theYear,
						pos=> intval( $current[colPos]),
						number=> trim( $current[colCountFemale]),
						error=> '',
					);
				}
			}
		}

		if( addNames) {
			global $HarvestNames;

			$this->parseDataAddNames( $ret->data);
			$HarvestNames->save();
		} else {
			$this->parseData( $ret->data);
			if( !$this->echoDataErrors( $ret->data, echoDataErrors)) {
				$ret->error = true;
				$ret->errorMsg = 'Unknown names found. No files saved!';
			}
			$ret->dataCount += count( $ret->data);

			if( !$ret->error) {
				$this->saveData( $ret->data, $ret->file, $ret->checksum, $ret->years, nuts);
			}
			$ret->data = Array();
		}

		finishCallback(ret);
	}*/

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
