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

	saveData: function (data, /*&*/ fileVec, /*&*/ checksumVec, /*&*/ yearVec, nuts, finishCallback) {
		'use strict';

		var filenames = [],
			dataCount = data.length,
			it,
			item,
			dest,
			filename,
			content,
			saved = 0,
			fileCount = 0;

		function fileSaved(filepath) {
			++saved;

			if (fileCount === saved) {
				console.log(fileCount + ' files saved. ' + nuts);
				finishCallback();
			}
		}

//		fileVec = [];
		checksumVec = [];
		yearVec = [];

		for (it = 0; it < dataCount; ++it) {
			item = data[it];
			dest = item.year + (item.male ? '_m' : '_f');
			filenames[dest] = 0;
		}

		for (filename in filenames) {
			++fileCount;
		}

		for (filename in filenames) {
			content = [];
			for (it = 0; it < dataCount; ++it) {
				item = data[it];
				dest = item.year + (item.male ? '_m' : '_f');
				if (dest === filename) {
					content.push(nuts + ';' + item.name + ';' + item.number + ';' + item.pos + ';' + (item.male ? 'male' : 'female') + ';' + item.year);
				}
			}

			this.saveDataToFile(filename, content, fileVec, checksumVec, yearVec, nuts, fileSaved);
		}

		// check md5!
		// fileVec, checksumVec and yearVec are overwritten ;-(
	},

	//-------------------------------------------------------------------

	saveDataToFile: function (filename, content, /*&*/ fileVec, /*&*/ checksumVec, /*&*/ yearVec, nuts, callback) {
		'use strict';

		var fs = require('fs'),
			path = 'harvest/' + nuts.substr(0, 2) + '/' + nuts.substr(0, 3) + '/' + nuts + '/' + nuts + '_' + filename + '.csv',
			file = './' + path,
			out = "NUTS;GIVENNAME;COUNT;RANKING;SEX;YEAR\n";

		out += content.join("\n");

		fileVec.push(path);
//		checksumVec.push(md5(out));
		if (-1 === yearVec.indexOf(filename.substr(0, 4))) {
			yearVec.push(filename.substr(0, 4));
		}

		console.log(file);
		fs.writeFile(file, out, function (err) {
			console.log('It\'s saved! ' + nuts + filename);
			callback(file);
		});
	}

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
