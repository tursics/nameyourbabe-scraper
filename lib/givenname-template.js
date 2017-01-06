/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

//	reverseMales: [],
//	reverseFemales: [],

	//-------------------------------------------------------------------

	getName: function () {
		'use strict';

		return 'template';
	},

	//-------------------------------------------------------------------

	accept: function (vec, vecCount) {
		'use strict';

		return false;
	},

	//-------------------------------------------------------------------

	parse: function (vec, vecCount, nuts, url, echoDataErrors, addNames) {
		'use strict';

		var ret = require('./givenname-result').copy();
		return ret;
	},

	//-------------------------------------------------------------------

/*	parseData: function (& data) {
		'use strict';

		dataCount = count(data);

		for( it = 0; it < dataCount; ++it) {
			item = & data[it];
			$isBoy = item['male'];
			item['name'] = normalizer_normalize( item['name']);
			item['error'] = $this->parseNames( item, $isBoy);
		}
	},*/

	//-------------------------------------------------------------------

/*	parseDataAddNames: function (& data) {
		'use strict';

		dataCount = count(data);

		for( it = 0; it < dataCount; ++it) {
			item = & data[it];
			$isBoy = item['male'];
			item['name'] = normalizer_normalize( item['name']);
			$this->parseNames( item, $isBoy);
		}
	},*/

	//-------------------------------------------------------------------

	saveData: function (data, /*&*/ fileVec, /*&*/ checksumVec, /*&*/ yearVec, nuts) {
		'use strict';

		var filenames = [],
			dataCount = data.length,
			it,
			item,
			dest;

//		fileVec = [];
		checksumVec = [];
		yearVec = [];

		for (it = 0; it < dataCount; ++it) {
			item = data[it];
			dest = item.year + (item.male ? '_m' : '_f');
			filenames[dest] = 0;
		}

/*		filenames.forEach(function (filename) {
			$content = Array();
			for( it = 0; it < dataCount; ++it) {
				item = data[it];
				dest = item['year'].(item['male']?'_m':'_f');
				if( dest == filename) {
					$content[] = nuts.';'.item['name'].';'.item['number'].';'.item['pos'].';'.(item['male']?'male':'female').';'.item['year'];
				}
			}

			$this->saveDataToFile( filename, $content, fileVec, checksumVec, yearVec, nuts);
		});*/

		// check md5!
		// fileVec, checksumVec and yearVec are overwritten ;-(
	}

	//-------------------------------------------------------------------

/*	saveDataToFile: function (filename, $content, & fileVec, & checksumVec, & yearVec, nuts) {
		'use strict';

		$path = 'data/harvest/'.substr(nuts, 0, 2).'/'.nuts.'/'.nuts.'_'.filename.'.csv';
		$file = dirname(__FILE__) . '/' . $path;
		$out = "NUTS;GIVEN_NAME;NUMBER;RANKING;SEX;YEAR\n";
		$out .= implode( "\n", $content);
		file_put_contents( $file, $out);

		fileVec[] = $path;
		checksumVec[] = md5( $out);
		if( !isset( yearVec[substr( filename, 0, 4)])) {
			yearVec[] = substr( filename, 0, 4);
		}
	},*/

	//-------------------------------------------------------------------

/*	parseNames: function (item, $isBoy) {
		'use strict';

		global $HarvestNames;

		$ret = '';
		$found = false;
		$name = item['name'];
		$nameUFT8 = $name;

		$HarvestNames->load();
		if( 0 == count( $this->reverseMales)) {
			$this->reverseMales = array_flip( $HarvestNames->male);
		}
		if( 0 == count( $this->reverseFemales)) {
			$this->reverseFemales = array_flip( $HarvestNames->female);
		}

		if( $isBoy) {
//			$found = in_array($nameUFT8, $HarvestNames->male);
			$found = isset( $this->reverseMales[ $nameUFT8]);
		} else {
//			$found = in_array($nameUFT8, $HarvestNames->female);
			$found = isset( $this->reverseFemales[ $nameUFT8]);
		}

		if( $found) {
			return '';
		}

		if( $isBoy) {
			$HarvestNames->male[] = $name;
//			unset( $this->reverseMales);
			$this->reverseMales = array_flip( $HarvestNames->male);
		} else {
			$HarvestNames->female[] = $name;
//			unset( $this->reverseFemales);
			$this->reverseFemales = array_flip( $HarvestNames->female);
		}

		$ret .= 'New name <span style="color:';
		if( $isBoy) {
			$ret .= 'DeepSkyBlue';
		} else {
			$ret .= 'Coral';
		}
		return $ret . '">' . $name . '</span>';
	}*/

	//-------------------------------------------------------------------

/*	echoDataErrors: function (data, $echoDataErrors) {
		'use strict';

		$ret = true;
		dataCount = count(data);

		for( it = 0; it < dataCount; ++it) {
			item = data[it];
			if( '' != item['error']) {
				$ret = false;

				if( $echoDataErrors) {
					echo item['error'] . ' (#' . item['pos'] . ' ' . (item['male']?'male':'female') . ' in ' . item['year'] . ')<br>';
				} else {
					return $ret;
				}
			}
		}

		return $ret;
	}*/

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
