'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');

// Walk function to recursively get files
var _walk = function(root, includeRegex, excludeRegex, removePath) {
	var output = [];
	var directories = [];
<<<<<<< HEAD

	// First read through files 
=======
	includeRegex = includeRegex || /(.*)\.(js|coffee)$/;

	// First read through files
>>>>>>> 635204acf7619b012d460dc3bf44724f171e3c31
	fs.readdirSync(root).forEach(function(file) {
		var newPath = root + '/' + file;
		var stat = fs.statSync(newPath);

		if (stat.isFile()) {
			if (includeRegex.test(file) && (!excludeRegex || !excludeRegex.test(file))) {
				output.push(newPath.replace(removePath, ''));
			}
		} else if (stat.isDirectory()) {
			directories.push(newPath);
		}
	});

	// Then recursively add directories
	directories.forEach(function(directory) {
		output = output.concat(_walk(directory, includeRegex, excludeRegex, removePath));
	});

	return output;
};

/**
 * Exposing the walk function
 */
<<<<<<< HEAD
exports.walk = _walk;
=======
exports.walk = _walk;
>>>>>>> 635204acf7619b012d460dc3bf44724f171e3c31
