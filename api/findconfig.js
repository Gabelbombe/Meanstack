
module.exports = (function() {
  
  var environment = process.env.ENVIRONMENT;

    environment = (environment)
     ? environment.toLowerCase()
     : 'localhost'

	return require("../lib/config/api/config." + environment + ".js");
})();
