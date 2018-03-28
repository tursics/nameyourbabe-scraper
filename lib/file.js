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
			request = require('request');

		if (uri.indexOf('https://') === 0) {
			request({
				url: uri,
				headers: {'User-Agent': 'Friendly Tursics Crawler'}
			}, function (error, response, body) {
				fs.writeFile(filepath, body, function () {
					callback();
				});
			});
		} else if (uri.indexOf('http://') === 0) {
			request({
				url: uri,
				headers: {'User-Agent': 'Friendly Tursics Crawler'}
			}, function (error, response, body) {
				fs.writeFile(filepath, body, function () {
					callback();
				});
			});
		} else {
			callback();
		}
	},

	//-------------------------------------------------------------------

	download: function (uri, pathName, fileName, fileExtension, userData, callback) {
		'use strict';

		var fs = require('fs'),
			now = new Date(),
			cachepath = './cache',
			path = cachepath + '/' + pathName,
			destname = fileName + '-' + now.getFullYear() + this.privateTwoDigits(now.getMonth() + 1) + this.privateTwoDigits(now.getDate()) + '.' + fileExtension.toLowerCase(),
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

	loadJSON: function (filepath, userData, callback) {
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
	},

	//-------------------------------------------------------------------

	loadTXT: function (filepath, userData, callback) {
		'use strict';

		var fs = require('fs');

		if (fs.existsSync(filepath)) {
			fs.readFile(filepath, 'utf-8', function (err, txt) {
				if (err) {
					console.error(err);
				} else {
					callback(txt, userData);
				}
			});
		} else {
			callback(null, userData);
		}
	}

	//-------------------------------------------------------------------

};

//-----------------------------------------------------------------------
//eof
