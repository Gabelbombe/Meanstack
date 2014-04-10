'use strict';

var passport = require('passport'),
	User = require('mongoose').model('User'),
	path = require('path'),
	utilities = require('./utilities');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
		User.findOne({
			_id: id
		}, '-salt -password', function(err, user) {
			done(err, user);
		});
	});

	// Initialize strategies
<<<<<<< HEAD
	utilities.walk('./config/strategies', /(.*)\.(js$|coffee$)/).forEach(function(strategyPath) {
		require(path.resolve(strategyPath))();
	});
};
=======
	utilities.walk('./config/strategies').forEach(function(strategyPath) {
		require(path.resolve(strategyPath))();
	});
};
>>>>>>> 635204acf7619b012d460dc3bf44724f171e3c31
