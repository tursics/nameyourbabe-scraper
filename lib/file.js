/*jslint browser: true*/
/*global console,require,module*/

//-----------------------------------------------------------------------

module.exports = {

	//-------------------------------------------------------------------

	privateTwoDigits: function (val) {
		'use strict';

		return val.toString().length < 2 ? '0' + val : val.toString();
	},

	//-------------------------------------------------------------------

	privateDownloadFile: function (filepath, uri, callback) {
		'use strict';

		var fs = require('fs'),
			http = require('http'),
			https = require('https'),
			file = fs.createWriteStream(filepath);

		if (uri.indexOf('https://') === 0) {
			file.on('finish', function () {
				file.close(callback);
			});

			https.get(uri, function (response) {
				response.pipe(file);
			});
		} else {
			file.on('finish', function () {
				file.close(callback);
			});

			http.get(uri, function (response) {
				response.pipe(file);
			});
		}
	},

	//-------------------------------------------------------------------

	download: function (uri, pathName, fileName, callback, userData) {
		'use strict';

		var fs = require('fs'),
			now = new Date(),
			cachepath = './cache',
			path = cachepath + '/' + pathName,
			destname = fileName + '-' + now.getFullYear() + this.privateTwoDigits(now.getMonth() + 1) + this.privateTwoDigits(now.getDate()) + '.json',
			destpath = path + '/' + destname,
			found = false,
			that = this;

		if (!fs.existsSync(cachepath)) {
			fs.mkdirSync(cachepath);
		}
		if (!fs.existsSync(path)) {
			fs.mkdirSync(path);
		}

		fs.readdir(path, function (err, files) {
			files.forEach(function (file) {
				if (file === destname) {
					found = true;

					callback(destpath, userData);
				}
			});

			if (!found) {
				that.privateDownloadFile(destpath, uri, function () {
					callback(destpath, userData);
				});
			}
		});
	},

	//-------------------------------------------------------------------

	loadJSON: function (filepath, callback, userData) {
		'use strict';

		var fs = require('fs');

		if (fs.existsSync(filepath)) {
			fs.readFile(filepath, 'utf-8', function (err, json) {
				if (err) {
					console.error(err);
				} else {
					if (typeof json === 'string') {
						try {
							json = JSON.parse(json);
						} catch (x) {
//							console.error(x);
							json = null;
						}
					}

					callback(json, userData);
				}
			});
		} else {
			callback(null, userData);
		}
	},

	//-------------------------------------------------------------------

	loadXML: function (filepath, callback) {
		'use strict';

		var fs = require('fs'),
			xml2json = require('xml2json');

		if (fs.existsSync(filepath)) {
			fs.readFile(filepath, 'utf-8', function (err, xml) {
				if (err) {
					console.error(err);
				} else {
					var json = xml2json.toJson(xml);
					json = JSON.parse(json);

					callback(json);
				}
			});
		} else {
			callback(null);
		}
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
