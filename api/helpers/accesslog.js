
// modified from:
// https://github.com/petershaw/NodeJS-Apache-Like-AccessLog/blob/master/accesslog.js


var sprintf     = require("util").format,
    path        = require('path'),
    alogger     = require("./logging.js")("access"),
    pLogger     = require("./logging.js")("performance"),
    pThreshold  = require("../findconfig.js").pThreshold,
    dateformat  = require('date-format-lite');

module.exports = function(request, response, next) {
	var starttime = Date.now();
	// from behind a proxy
	var clientAddr = request.headers['X-Forwarded-For'];
	if( clientAddr == undefined ) {
		// direct connection
		clientAddr = request.connection.remoteAddress;
	}
	// get username (if available)
	var username = "-";
	if(request.session && request.session.user) {
		username = request.session.user;
	} 
  else if (request.session && request.session.id) {
    username = request.session.id;
	}

  if (typeof next === 'function') {
    next();
  }
  
  var endtime = Date.now();
  var rendertime = Math.round(endtime - starttime);

  var now = new Date();
  var p0 =	sprintf("%s - %s [%s/%s/%s %s:%s:%s] %s", 
  		clientAddr, 
  		username,
  		now.format("DD"),
  		now.format("MMM"),
  		now.format("YYYY"),
  		now.format("hh"),
  		now.format("mm"),
  		now.format("ss"),
  		rendertime
  	);
  	
  var p1 =	sprintf('"%s %s %s/%s"', 
    request.method,
    request.url,
    request.protocol.toUpperCase(),
    request.httpVersion
  )
  
  var p2 = '"'+response.req.headers['user-agent']+'"';

  var p3 =	sprintf("%d %s", 
    response.statusCode,
    response._headers['content-length']
  );
  
  alogger.debug(p0+" "+p1+" "+p2+" "+p3);
  
  if (pThreshold !== false && rendertime > pThreshold) {
    pLogger.warn(p1+" rendertime: "+rendertime);
  }
};

