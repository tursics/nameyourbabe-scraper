/*jslint browser: true*/
/*global require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	parserVec: [],

	//-------------------------------------------------------------------

	init: function () {
		'use strict';

		if (this.parserVec.length === 0) {
			this.parserVec.push(require('./givenname-template'));
//			this.parserVec.push(require('./givenname-NUTS'));
//			this.parserVec.push(require('./givenname-NUTSAlt1'));
//			this.parserVec.push(require('./givenname-NUTSAlt2'));
			this.parserVec.push(require('./givenname-AutiSta'));
			this.parserVec.push(require('./givenname-AutiStaScan'));
//			this.parserVec.push(require('./givenname-AutiStaScan2'));
//			this.parserVec.push(require('./givenname-AutiStaScan3'));
//			this.parserVec.push(require('./givenname-AutiStaScan4'));
			this.parserVec.push(require('./givenname-Zuerich'));
//			this.parserVec.push(require('./givenname-Linz'));
//			this.parserVec.push(require('./givenname-Vorarlberg'));
//			this.parserVec.push(require('./givenname-Engerwitzdorf'));
//			this.parserVec.push(require('./givenname-Salzburg'));
//			this.parserVec.push(require('./givenname-CKANDataset'));
//			this.parserVec.push(require('./givenname-DoubleColumned'));
		}
	},

	//-------------------------------------------------------------------

	parse: function (vec, vecCount, nuts, url, title, echoDataErrors, callback) {
		'use strict';

		var i, parser, ret;

		this.init();

		for (i = 0; i < this.parserVec.length; ++i) {
			parser = this.parserVec[i];
			if (parser.accept(vec, vecCount)) {
				parser.parse(vec, vecCount, nuts, url, title, echoDataErrors, true, callback);
				return;
			}
		}

		ret = require('./givenname-result').copy();
		ret.error = true;
		ret.errorMsg = 'Unknown data format found';

		callback(ret);
	},

	//-------------------------------------------------------------------

	getParserClass: function (vec, vecCount) {
		'use strict';

		var i, parser;

		this.init();

		for (i = 0; i < this.parserVec.length; ++i) {
			parser = this.parserVec[i];
			if (parser.accept(vec, vecCount)) {
				return parser.getName();
			}
		}

		return 'No parser found';
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof

/*
<?php

class HarvestDataParserNUTS extends HarvestDataParserBase
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 0) && (vec[0][0] == 'NUTS2');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Lower Austria, ...
		$ret = new HarvestDataResult();

		$colName = -1;
		$colSex = -1;
		$colYear = -1;
		$colPos = -1;
		$colCount = -1;
		$startRow = 0;

		$row = 0;
		// häufigste
		if( 6 === strpos( vec[ $row][0], 'ufigste')) {
			if( 228 == ord( vec[ $row][0][5])) {
				convertVecVecToUTF8( vec);
			}
		}

		for( $row = 0; $row < 3; ++$row) {
			for( $col = 0; $col < count( vec[ $row]); ++$col) {
				if( trim( vec[ $row][ $col]) == 'GIVEN_NAME') {
					$colName = $col;
					$startRow = $row;
				} else if( trim( vec[ $row][ $col]) == 'SEX') {
					$colSex = $col;
					$startRow = $row;
				} else if( trim( vec[ $row][ $col]) == 'YEAR') {
					$colYear = $col;
					$startRow = $row;
				} else if( trim( vec[ $row][ $col]) == 'REF_YEAR') {
					$colYear = $col;
					$startRow = $row;
				} else if( trim( vec[ $row][ $col]) == 'NUMBER') {
					$colCount = $col;
					$startRow = $row;
				} else if( trim( vec[ $row][ $col]) == 'RANKING_REF_YEAR') {
					$colPos = $col;
					$startRow = $row;
				}
			}
		}

		if(( -1 == $colName) || (-1 == $colSex) ||(-1 == $colYear)) {
			$ret->errorMsg = 'Unknown NUTS format!';
			return $ret;
		}

		$ret->data = Array();
		$posVec = Array();
		$posVec['1'] = Array(); // male
		$posVec['2'] = Array(); // female

		if( vec[ $row][ $colSex] == '1') {
		} else if( vec[ $row][ $colSex] == '2') {
		} else {
			$ret->errorMsg = 'Unknown sex in NUTS format!';
			return $ret;
		}

		$name = trim( vec[ $startRow + 1][ $colName], '* ');
		$needUC = ($name == strtoupper( $name));

		for( $row = $startRow + 1; $row < count( vec); ++$row) {
			if( count( vec[ $row]) > 1) {
				if(( '' == vec[ $row][ $colName]) && ('' == vec[ $row][ $colCount]) && ('' == vec[ $row][ $colSex])) {
					continue;
				}

				if( $posVec[ vec[ $row][ $colSex]][ vec[ $row][ $colYear]] == NULL) {
					$posVec[ vec[ $row][ $colSex]][ vec[ $row][ $colYear]] = 0;
				}
				++$posVec[ vec[ $row][ $colSex]][ vec[ $row][ $colYear]];

				$name = trim( vec[ $row][ $colName], '* ');
				if( $needUC) {
					if( $name == "Z\xdcMRA") {
						$name = 'Zümra';
					} else if( $name == "\xd6MER") {
						$name = 'Ömer';
					} else if( $name == "H\xdcSEYIN") {
						$name = 'Hüseyin';
					} else if( $name == "YAGMUR") {
						$name = 'Yağmur';
					} else if( $name == "NOEL") {
						$name = 'Noël';
					} else if( $name == "IREM") {
						$name = 'İrem';
					} else if( $name == "ILAYDA") {
						$name = 'İlayda';
					} else if( $name == "ANNA-LENA") {
						$name = 'Anna-Lena';
					} else if( $name == "ANNA-MARIA") {
						$name = 'Anna-Maria';
					} else if( $name == "ANNA-SOPHIE") {
						$name = 'Anna-Sophie';
					} else if( $name == "LISA-MARIE") {
						$name = 'Lisa-Marie';
					} else {
						$name = ucwords( strtolower( $name));
					}
				} else {
					if( $name == "Lisa-marie") {
						$name = 'Lisa-Marie';
					}
				}

				if( $name == 'Rene') {
					$name = 'René';
				}

				$ret->data[] = Array(
					name=> $name,
					male=> vec[ $row][ $colSex] == '1' ? true : false,
					year=> trim( vec[ $row][ $colYear]),
					pos=> $colPos == -1 ? $posVec[ vec[ $row][ $colSex]][ vec[ $row][ $colYear]] : vec[ $row][ $colPos],
					number=> trim( vec[ $row][ $colCount]),
					error=> '',
				);
			}
		}

		$this->parseData( $ret->data);
		$this->saveData( $ret->data, $ret->file, $ret->checksum, $ret->years, $nuts);
		$ret->dataCount += count( $ret->data);

		$ret->error = false;
		$ret->errorMsg = '';

		return $ret;
	}

	public function strtotimeLoc( $date_string)
	{
		$ret = strtotime( $date_string);
		if( $ret === false) {
			$date_string = strtr( strtolower( $date_string), array('januar'=>'jan','februar'=>'feb','märz'=>'march','april'=>'apr','mai'=>'may','juni'=>'jun','juli'=>'jul','august'=>'aug','september'=>'sep','oktober'=>'oct','november'=>'nov','dezember'=>'dec'));
			$ret = strtotime( $date_string);
			if( $ret === false) {
				$date_string = strtr( $date_string, array('-'=>''));
				$ret = strtotime( $date_string);
			}
		}
		return $ret;
	}
} // class HarvestDataParserNUTS
$HarvestData->addParser('HarvestDataParserNUTS');

//------------------------------------------------------------------------------

class HarvestDataParserNUTSAlt1 extends HarvestDataParserNUTS
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 2) && (vec[2][1] == 'NUTS2');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Vienna, ...
		return parent::parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames);
	}
} // class HarvestDataParserNUTSAlt1
$HarvestData->addParser('HarvestDataParserNUTSAlt1');

//------------------------------------------------------------------------------

class HarvestDataParserNUTSAlt2 extends HarvestDataParserNUTS
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 0) && (vec[0][1] == 'NUTS2');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Styria, ...
		return parent::parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames);
	}
} // class HarvestDataParserNUTSAlt2
$HarvestData->addParser('HarvestDataParserNUTSAlt2');

//------------------------------------------------------------------------------

class HarvestDataParserAutiStaScan2 extends HarvestDataParserAutiStaScan
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 1) && (vec[1][0] == 'Anzahl der  Kinder mit');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Bremen, ...
		return parent::parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames);
	}
} // class HarvestDataParserAutiStaScan2
$HarvestData->addParser('HarvestDataParserAutiStaScan2');

//------------------------------------------------------------------------------

class HarvestDataParserAutiStaScan3 extends HarvestDataParserAutiStaScan
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 2) && (trim( vec[2][0]) == 'Anzahl der Kinder mit');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Munich, ...
		return parent::parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames);
	}
} // class HarvestDataParserAutiStaScan3
$HarvestData->addParser('HarvestDataParserAutiStaScan3');

//------------------------------------------------------------------------------

class HarvestDataParserAutiStaScan4 extends HarvestDataParserAutiStaScan
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 3) && (trim( vec[3][0]) == 'Anzahl der Kinder mit');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Bochum, ...
		return parent::parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames);
	}
} // class HarvestDataParserAutiStaScan4
$HarvestData->addParser('HarvestDataParserAutiStaScan4');

//------------------------------------------------------------------------------

class HarvestDataParserLinz extends HarvestDataParserBase
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 0) && (vec[0][0] == 'Rang') && (vec[0][1] == 'Geschlecht') && (trim( vec[0][2]) == 'Vorname');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Used in Linz
		$ret = new HarvestDataResult();

		// Beliebteste Vornamen 0-4 Jährige am 01.01.$year  | /Beliebteste_Vornamen_0-4_Jaehrige_am_1_1_$year.csv
		// Beliebteste Vornamen 5-9 Jährige am 01.01.$year  | /Beliebteste_Vornamen_5-9_Jaehrige_am_1_1_$year.csv
		// Beliebteste Vornamen des Jahres $year            | /Beliebteste_Vornamen_des_Jahres_$year.csv
		// Beliebteste Vornamen aller Linzer am 01.01.$year | /Beliebteste_Vornamen_aller_Linzer_am_1_1_$year.csv

		$theYear = intval( substr( $url, strlen( $url) - 8, 4));

		if( false !== strpos( $url, 'Beliebteste_Vornamen_0-4_Jaehrige')) {
			// ignore data
			$ret->error = false;
			$ret->errorMsg = '';
			return $ret;
		}
		if( false !== strpos( $url, 'Beliebteste_Vornamen_5-9_Jaehrige')) {
			// ignore data
			$ret->error = false;
			$ret->errorMsg = '';
			return $ret;
		}
		if( false !== strpos( $url, 'Beliebteste_Vornamen_aller_Linzer')) {
			// ignore data
			$ret->error = false;
			$ret->errorMsg = '';
			return $ret;
		}

		$colName = 2;
		$colSex = 1;
//		$colYear = -1;
		$colPos = 0;
//		$colCount = -1;
		$startRow = 0;

		vecCount = count( vec);
		if( vecCount < 2) {
			$ret->errorMsg = 'Unknown Linz format!';
			return $ret;
		}

		$ret->data = Array();

		$lastPos = 1;
		for( $row = $startRow + 1; $row < vecCount; ++$row) {
			if( count( vec[ $row]) > 1) {
				$pos = intVal( vec[ $row][ $colPos]);
				if( 0 != $pos) {
					$lastPos = $pos;
				}

				$ret->data[] = Array(
					name=> trim( vec[ $row][ $colName]),
					male=> vec[ $row][ $colSex] == 'weiblich' ? false : true,
					year=> $theYear,
					pos=> $lastPos,
					number=> 0,
					error=> '',
				);
			}
		}

		$this->parseData( $ret->data);
		$this->saveData( $ret->data, $ret->file, $ret->checksum, $ret->years, $nuts);
		$ret->dataCount += count( $ret->data);

		$ret->error = false;
		$ret->errorMsg = '';

		return $ret;
	}
} // class HarvestDataParserLinz
$HarvestData->addParser('HarvestDataParserLinz');

//------------------------------------------------------------------------------

class HarvestDataParserVorarlberg extends HarvestDataParserBase
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 0) && (vec[0][0] == 'Jahr') && (vec[0][1] == 'Geschlecht') && (trim( vec[0][2]) == 'Vorname');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Used in Vorarlberg
		$ret = new HarvestDataResult();

		$colName = 2;
		$colSex = 1;
		$colYear = 0;
		$colPos = 3;
//		$colCount = -1;
		$startRow = 0;
		$yearPos = 0;
		$oldYear = 0;

		// Mädchen
		if( 2 === strpos( vec[ 1][1], 'dchen')) {
			if( 228 == ord( vec[ 1][1][1])) {
				convertVecVecToUTF8( vec);
			}
		}

		vecCount = count( vec);
		if( count( vec) < 2) {
			$ret->errorMsg = 'Unknown Vorarlberg format!';
			return $ret;
		}

		$ret->data = Array();

		for( $row = $startRow + 1; $row < vecCount; ++$row, ++$yearPos) {
			if( count( vec[ $row]) > 1) {
				if( $oldYear != intval( vec[ $row][ $colYear])) {
					$oldYear = intval( vec[ $row][ $colYear]);
					$yearPos = 1;
				}

				$ret->data[] = Array(
					name=> trim( vec[ $row][ $colName], '* '),
					male=> vec[ $row][ $colSex] == 'Knaben' ? true : false,
					year=> trim( vec[ $row][ $colYear]),
					pos=> $yearPos,
					number=> trim( vec[ $row][ $colPos]),
					error=> '',
				);
			}
		}

		$this->parseData( $ret->data);
		$this->saveData( $ret->data, $ret->file, $ret->checksum, $ret->years, $nuts);
		$ret->dataCount += count( $ret->data);

		$ret->error = false;
		$ret->errorMsg = '';

		return $ret;
	}
} // class HarvestDataParserVorarlberg
$HarvestData->addParser('HarvestDataParserVorarlberg');

//------------------------------------------------------------------------------

class HarvestDataParserEngerwitzdorf extends HarvestDataParserBase
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 0) && (substr( vec[0][0], 0, 21) == 'GemeindeEngerwitzdorf');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Used in Engerwitzdorf
		$ret = new HarvestDataResult();

		vecCount = count( vec);

		if( vecCount < 12) {
			$ret->errorMsg = 'Unknown Engerwitzdorf format!';
			return $ret;
		}

		$row = 3;
		$theYear = intval( vec[ $row][0]);
		$row += 2;
		if( $theYear != intval( vec[ $row][0])) {
			$ret->errorMsg = 'Unknown Engerwitzdorf year format... ' . $theYear . ' != ' . vec[ $row][0];
			return $ret;
		}

		$isMale = true;
		$row += 3;
		if( 'weibl.' == trim( vec[ $row][0])) {
			$isMale = false;
		} else if( "m\xe4nnl." != trim( vec[ $row][0])) {
			$ret->errorMsg = 'Unknown Engerwitzdorf sex format... ' . vec[ $row][0];
			return $ret;
		}

		if(( '' != trim( vec[ $row + 1][0])) || ('' != trim( vec[ $row + 2][0]))) {
			$ret->errorMsg = 'Unknown Engerwitzdorf line feed format...';
			return $ret;
		}
		$row += 3;

		$ret->data = Array();
		$thePos = 1;

		for( ; ($row < vecCount) && (0 < strlen( trim( vec[ $row][0]))); ++$row) {
			$theName = trim( vec[ $row][0]);
			if( is_numeric( $theName)) {
				continue;
			}

			$nameExists = false;
			for( $i = 0; $i < count( $ret->data); ++$i) {
				if( $ret->data[ $i]['name'] == $theName) {
					$nameExists = true;
				}
			}

			if( $nameExists) {
				continue;
			}

			$ret->data[] = Array(
				name=> $theName,
				male=> $isMale,
				year=> $theYear,
				pos=> $thePos,
				number=> 0,
				error=> '',
			);
			++$thePos;
		}

		$this->parseData( $ret->data);
		$this->saveData( $ret->data, $ret->file, $ret->checksum, $ret->years, $nuts);
		$ret->dataCount += count( $ret->data);

		$ret->error = false;
		$ret->errorMsg = '';

		return $ret;
	}
} // class HarvestDataParserEngerwitzdorf
$HarvestData->addParser('HarvestDataParserEngerwitzdorf');

//------------------------------------------------------------------------------

class HarvestDataParserSalzburg extends HarvestDataParserBase
{
	public function accept( vec, vecCount)
	{
//		return (vecCount > 0) && (vec[0][0] == 'Rang') && (vec[0][1] == 'NUTS') && (trim( vec[0][2]) == 'Geschlecht') && (trim( vec[0][3]) == 'Vorname') && (trim( vec[0][4]) == 'Jahr');
		return (vecCount > 0) && (vec[0][1] == 'NUTS') && (trim( vec[0][2]) == 'Geschlecht') && (trim( vec[0][3]) == 'Vorname') && (trim( vec[0][4]) == 'Jahr');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Used in Salzburg
		$ret = new HarvestDataResult();

		$colName = 3;
		$colSex = 2;
		$colYear = 4;
		$colPos = 0;
//		$colCount = -1;
//		$colNuts = 1;
		$currentPos = 0;

		vecCount = count( vec);
		if( vecCount < 2) {
			$ret->errorMsg = 'Unknown Salzburg format!';
			return $ret;
		}

		$ret->data = Array();

		for( $row = 1; $row < vecCount; ++$row) {
			if( count( vec[ $row]) > 1) {
				if(( '' == vec[ $row][ $colPos]) && ('' == vec[ $row][ $colSex])) {
					continue;
				}
//				if( '' == vec[ $row][ $colName]) {
//					continue;
//				}
				if( strlen( trim( vec[ $row][ $colPos])) > 0) {
					$currentPos = vec[ $row][ $colPos];
				}

				$ret->data[] = Array(
					name=> trim( vec[ $row][ $colName]),
					male=> vec[ $row][ $colSex] == 'weiblich' ? false : true,
					year=> trim( vec[ $row][ $colYear]),
//					year=> '2013',
					pos=> $currentPos,
					number=> 0,
					error=> '',
				);
			}
		}

		$this->parseData( $ret->data);
		$this->saveData( $ret->data, $ret->file, $ret->checksum, $ret->years, $nuts);
		$ret->dataCount += count( $ret->data);

		$ret->error = false;
		$ret->errorMsg = '';

		return $ret;
	}
} // class HarvestDataParserSalzburg
$HarvestData->addParser('HarvestDataParserSalzburg');

//------------------------------------------------------------------------------

class HarvestDataParserCKANDataset extends HarvestDataParserBase
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 0) && (substr( vec[0][0], 0, 14) == '<!DOCTYPE html');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		global $MetadataVec;
		global $HarvestMetadata;
		global $dataHarvestMetadata;

		// Used in Cologne, Bonn
		$ret = new HarvestDataResult();
		$ret->errorMsg = 'Unknown CKAN dataset format!';

		vecCount = count( vec);
		for( $row = 0; $row < vecCount; ++$row) {
			if( false !== strpos( vec[$row][0], 'class="download"')) {
				$posLicUrl = strpos( vec[$row][0], 'href="') + strlen( 'href="');
				$strLicUrl = substr( vec[$row][0], $posLicUrl, strpos( vec[$row][0], '"', $posLicUrl) - $posLicUrl);

				for( $i = 0; $i < count( $MetadataVec); ++$i) {
					if( $nuts == $MetadataVec[$i]['nuts']) {
						$harvest = & $dataHarvestMetadata[ $MetadataVec[$i]['meta']];

						for( $idx = 0; $idx < count( $harvest['url']); ++$idx) {
							$download = $harvest['download'][$idx];
							if( $url == $download) {
//								$url = $harvest['url'][$idx];
//								$url = substr( $url, 0, strpos( $url, '/', strpos( $url, '//') + 2));
//								$url .= $strLicUrl;
								$url = $strLicUrl;

								$ret->errorMsg = 'Updated metadata. Please reload this site!';

								$harvest['url'][$idx] = $url;
								$harvest['download'][$idx] = '';
							}
						}

						$HarvestMetadata->save();
					}
				}
			}
		}

		return $ret;
	}
} // class HarvestDataParserCKANDataset
$HarvestData->addParser('HarvestDataParserCKANDataset');

//------------------------------------------------------------------------------

class HarvestDataParserDoubleColumned extends HarvestDataParserBase
{
	public function accept( vec, vecCount)
	{
		return (vecCount > 0) && (vec[0][0] == '"Vorname"') && (trim( vec[0][1]) == '"Anzahl"')
		    || (vecCount > 0) && (vec[0][0] == 'vorname') && (trim( vec[0][1]) == 'anzahl');
	}

	public function parse( vec, vecCount, $nuts, $url, $echoDataErrors, $addNames)
	{
		// Used in Munich, Rostock
		$ret = new HarvestDataResult();

		// Vornamen 2013 männlich: vornamenmaennlich2013.csv
		// Vornamen 2013 weiblich: vornamenweiblich2013.csv

		$theYear = intval( substr( $url, strlen( $url) - 8, 4));
		$theMale = true;
		if( false !== strpos( $url, 'weiblich')) {
			$theMale = false;
		}

		$colName = 0;
//		$colSex = -1;
//		$colYear = -1;
//		$colPos = -1;
		$colCount = 1;
		$startRow = 0;

		vecCount = count( vec);
		if( vecCount < 2) {
			$ret->errorMsg = 'Unknown Double Columned format!';
			return $ret;
		}

		$ret->data = Array();
		$ret->error = false;
		$ret->errorMsg = '';

		for( $row = $startRow + 1; $row < vecCount; ++$row) {
			if( count( vec[ $row]) > 1) {
				$name = trim( vec[ $row][ $colName], '"* ');

				if( $name == "Summe") {
					continue;
//				} else if( $name == "ogly") {
//					continue;
//				} else if( $name == "kyzy") {
//					continue;
				} else if( $name == "kysy") {
					continue;
				} else if( $name == "und") {
					continue;
				} else if( $name == "Vatersname)") {
					continue;
				}

				$ret->data[] = Array(
					name=> $name,
					male=> $theMale,
					year=> $theYear,
					pos=> 0,
					number=> intVal( vec[ $row][ $colCount]),
					error=> '',
				);
			}
		}

		$this->generateDataPos( $ret->data);

		if( $addNames) {
			global $HarvestNames;

			$this->parseDataAddNames( $ret->data);
			$HarvestNames->save();
		} else {
			$this->parseData( $ret->data);
			if( !$this->echoDataErrors( $ret->data, $echoDataErrors)) {
				$ret->error = true;
				$ret->errorMsg = 'Unknown names found. No files saved!';
			}
			$ret->dataCount += count( $ret->data);

			if( !$ret->error) {
				$this->saveData( $ret->data, $ret->file, $ret->checksum, $ret->years, $nuts);
			}
		}

		return $ret;
	}

	public function generateDataPos( & $data)
	{
		usort( $data, "cmpHarvestDataParserZuerich");

		$dataCount = count( $data);
		$currentPos = 0;
		$currentNumber = 0;
		$currentMale = true;
		$yearPos = 1;

		for( $row = 0; $row < $dataCount; ++$row, ++$yearPos) {
			if( $currentMale != $data[ $row][ 'male']) {
				$currentMale = $data[ $row][ 'male'];
				$yearPos = 1;
			}
			if( $currentNumber != $data[ $row][ 'number']) {
				$currentNumber = $data[ $row][ 'number'];
				$currentPos = $yearPos;
			}
			$data[ $row][ 'pos'] = $currentPos;
		}
	}
} // class HarvestDataParserDoubleColumned
$HarvestData->addParser('HarvestDataParserDoubleColumned');

//------------------------------------------------------------------------------

?>
*/
