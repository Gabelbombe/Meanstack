
var express = require("express"),
    config  = require("./findconfig.js"),
    logger  = require("./helpers/logging.js")(),
    mongo   = require("./helpers/mongo.js");
    app     = express();

    app.set('port', process.env.PORT || config.server.port);
    app.use(express.bodyParser());
    app.use(require("./helpers/accesslog.js"));


// now we want to load the different end points
app.get("/", function(req, res, next) {
  res.send({
      result : true,
      note : "none",
      message : "hello world!"
    });
});


var endpoint = require("./ends/endpoint.js");
    config.endpoints.forEach(function(definition) {

var generic_enpoint = new endpoint(app, definition, mongo, logger, config);
  
  // overloading and other configuration should happen
  // here before init is called
  
  generic_enpoint.init();
});

var report_mediaplan = new (require("./ends/report.mediaplan.js"))(app, mongo, config);
    report_mediaplan.init();

var report_mediaplan_client = new (require("./ends/report.mediaplan_client.js"))(app, mongo, config);
    report_mediaplan_client.init();

var report_vehicles = new (require("./ends/report.vehicles.js"))(app, mongo, config);
    report_vehicles.init();

var syncs = new (require("./ends/sync.js"))(app, mongo, config);
    syncs.init();


    require("./helpers/cache.js").init(config.cache, logger);
    require("./helpers/logging.js")().info("app setup!");

//module.exports = app;
