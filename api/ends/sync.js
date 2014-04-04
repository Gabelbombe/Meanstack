
var parser = require("../helpers/parser.js");
var logger = require("../helpers/logging.js")();
var package_error = require("../helpers/error.js");
var http = require("http");
var config = require("../findconfig.js");
var formatter = require("util").format;

module.exports = function(app, _mongo, all_config) {
  
  var curr = this;
  this.mongo = _mongo;
  
  
  
  
  
  this.init = function() {
    var report = "setting up sync endpoints: \n";
    
    
    var get_endpoint_1 = "/sync/vehicles/harvest";
    report += (" - setup endpoint:  get "+get_endpoint_1+"\n");
    app.get(get_endpoint_1, this.harvest_vehicles);
    
    
    var get_endpoint_2 = "/sync/vehicle/:id";
    report += (" - setup endpoint:  get "+get_endpoint_2+"\n");
    app.get(get_endpoint_2, this.vehicle);
    
    
    logger.info(report);
  }
  
  
  
  
  this.vehicle = function(req, res) {
    
    var url = formatter(config.sync.vehicle, req.params.id);
    logger.warn("initiating vehicle sync: "+url);
    http.get(url, function(response) {
      var data = '';
      var report;
	  
	  console.log('STATUS: ' + response.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(response.headers));
	  response.setEncoding('utf8');
      
      response.on('data', function(chunk) {
		console.log(chunk);
        data += chunk;
		console.log(data);
      });

      response.on('end', function(chunk) {
        if (chunk) data += chunk;
        
        var new_vehicle;
        try {
          new_vehicle = JSON.parse(data);
        }
        catch(ex) {
          report = {
            ok : false,
            url : url,
            note : "unable to parse result from sync call",
            error : package_error(ex),
            raw_result : data
          };
          logger.error(report);
          res.send(report);
          return;
        }
        
        
        var vehicle_access = new (require("../dao/vehicle.js"))(curr.mongo, 
                                                                logger,
                                                                all_config);
        vehicle_access.upsert(new_vehicle.ID, new_vehicle, function(error) {
          
          report = {
            ok : true,
            url : url,
            note : "completed sync",
            error : (error ? package_error(error) : null),
            updated : new_vehicle
          };
          logger.warn(report);
          res.send(report);
        });
      });
      
    }).on('error', function(e) {
      var report = {
        ok : false,
        url : url,
        note : "unable to complete web call to get vehicles",
        error : package_error(e)
      };
      logger.error(report);
      res.send(report);
    });
  }
  
  
  
  
  
  this.harvest_vehicles = function(req, res) {
    logger.warn("initiating vehicle harvest: "+config.sync.harvest_vehicles);
    
    
    http.get(config.sync.harvest_vehicles, function(response) {
      var data = '';
      var report;
      
      response.on('data', function(chunk) {
        data += chunk;
      });

      response.on('end', function(chunk) {
        if (chunk) data += chunk;
        
        var json_array;
        try {
          json_array = JSON.parse(data);
        }
        catch(ex) {
          report = {
            ok : false,
            url : config.sync.harvest_vehicles,
            note : "unable to parse result from harvest call",
            error : package_error(ex),
            raw_result : data
          };
          logger.error(report);
          res.send(report);
          return;
        }
        
        if (json_array.length == 0) {
          report = {
            ok : false,
            url : config.sync.harvest_vehicles,
            note : "nothing to sync from harvest call",
            raw_result : data
          };
          return;
        }
        
        var upserted = [];
        var errors = [];
        var count_finished = 0;
        var finished_check = function() {
          count_finished++;
          logger.info("finished "+count_finished+"/"+json_array.length+
            "vehicle upsert attempt")
          if (count_finished >= json_array.length) {
            res.send({
              ok : true,
              url : config.sync.harvest_vehicles,
              count : json_array.length,
              error_count : errors.length,
              success_count : upserted.length
//              errors : errors,
//              vehicles : upserted
            });
          }
        }
        
        var vehicle_access = new (require("../dao/vehicle.js"))(curr.mongo, 
                                                                logger,
                                                                all_config);
        json_array.forEach(function(vehicle){
          try {
            vehicle_access.upsert(vehicle.ID, vehicle, function(error, result) {
              if (error) {
                errors.push({
                  vehicle : vehicle,
                  error : package_error(error)
                });
                finished_check();
              }
              else {
                upserted.push(vehicle);
                finished_check();
              }
            });
          }
          catch(ex) {
            errors.push({
              vehicle : vehicle,
              error : package_error(ex)
            });
            finished_check();
          }
        });
      });
      
    }).on('error', function(e) {
      var report = {
        ok : false,
        url : config.sync.harvest_vehicles,
        note : "unable to complete web call to get vehicles",
        error : package_error(e)
      };
      logger.error(report);
      res.send(report);
    });
  }
  
}





