
var configured = false;

module.exports = function(category) {
  var config = require("../findconfig.js");
  var log4js = require("log4js");
  
  if (!config) {
    var cluster = require('cluster');
    if (cluster.isMaster) {
      log4js.configure(config.logging.master);
    }
    else {
      log4js.configure(config.logging.fork);
    }
    configured = true;
  }
  
  if (category) {
    return log4js.getLogger(category);
  }
  else {
    return log4js.getLogger("default");
  }
};
