'use strict';

<<<<<<< HEAD
var _ = require('lodash');

// Load app configuration
module.exports = _.merge(require(__dirname + '/../config/env/all.js'), require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {});
=======
var _ = require('lodash'),
	utilities = require('./utilities');

process.env.NODE_ENV = ~utilities.walk('./config/env', /(.*)\.js$/).map(function(file) {
	return file.split('/').pop().slice(0, -3);
}).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

// Load app configurations
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);
>>>>>>> 635204acf7619b012d460dc3bf44724f171e3c31
