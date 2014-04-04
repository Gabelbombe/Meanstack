var cluster = require('cluster');

if (cluster.isMaster) {
  
  // first set up logging for the master
  var logger = require("./api/helpers/logging.js")();

  var num_cpus = require('os').cpus().length;
  logger.debug(num_cpus + " <-- that many CPUs detected!");

  // create a fork for each CPU (or "thread" for Intel CPUs...)
  for (var i = 0; i < num_cpus; i++) {
    cluster.fork();
  }

  // if one of the forks dies, spawn a replacement!
  cluster.on('exit', function (worker, code, sig) {
    var report = ('Worker '+worker.process.pid+' died... Creating a new one!\n');
    report += ('  -- code: '+code+'\n');
    report += ('  -- sig: '+sig+'\n');
    logger.warn(report);
    cluster.fork();
  });
  
  cluster.on('uncaughtException', function(error) {
    logger.error(error);
    process.exit();
  });
  
}
else {

  var http = require("http");
  var app = require("./api/ben_api.js");
  http.createServer(app).listen(app.get('port'), function () {
//    console.log('Express server listening on port ' + app.get('port'));
  });
}

