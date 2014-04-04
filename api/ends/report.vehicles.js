
var valuation = require("../helpers/valuation.js");
var demographics = require("../helpers/demographics.js");
var parser = require("../helpers/parser.js");
var logger = require("../helpers/logging.js")();
var input_parser = require("../helpers/parser.js");

module.exports = function(app, _mongo, all_config) {
  
  var curr = this;
  this.mongo = _mongo;
  this.vehicle_access = new (require("../dao/vehicle.js"))(this.mongo, 
                                                           logger, 
                                                           all_config);
  this.impression_access = new (require("../dao/impression.js"))(this.mongo, 
                                                                 logger, 
                                                                 all_config);
  
  
  
  this.init = function() {
    var report = "setting up report endpoints: \n";
    
    
    
    var get_endpoint_1 = "/report/vehicles";
    report += (" - setup endpoint:  get "+get_endpoint_1+"\n");
    app.get(get_endpoint_1, this.vehicle_list);
    
    var get_endpoint_2 = "/report/vehicles_orphans";
    report += (" - setup endpoint:  get "+get_endpoint_2+"\n");
    app.get(get_endpoint_2, this.orphan_vehicle_list);
    
    
    logger.info(report);
  }
  
  
  
  
  
  
  
  this.vehicle_list = function(req, res) {
    
    var vehicle_query = input_parser.query(req.query.query);
    var sort = input_parser.sort(req.query.sort);
    var page_size = input_parser.number(req.query.pagesize);
    var page_number = input_parser.number(req.query.pagenum);

    var options = {};
    if (page_size !== undefined && page_number !== undefined) {
      options.skip = (page_size * page_number);
      options.limit = (page_size);
    }
    if (!vehicle_query) {
      res.send({
        ok : false,
        query : null,
        note : "a 'query' field must be specified with valid json",
        error : "no 'query' specified"
      });
      return;
    }
    
    
    curr.vehicle_access.find({
      query : vehicle_query,
      sort : sort,
      options : options
    }, function(error, vehicles) {
      if (curr.mongo.is_mongo_error(res, error, vehicle_query)) return;
      
      
      if (vehicles) {
        var impressions_query = {'$or' : []};
        var vehicle_hash = {};
        for(var i = 0; i < vehicles.length; i++) {
          impressions_query.$or.push({VehicleID : vehicles[i].data.ID});
          vehicles[i].impressions = [];
          vehicle_hash[ vehicles[i].data.ID ] = vehicles[i];
        }
        
        curr.vehicle_access.count(vehicle_query, function(error, count) {
          if (curr.mongo.is_mongo_error(res, error, vehicle_query)) return;
        
          curr.impression_access.find({
            query : impressions_query,
            projection : {
              _id : 0,
              ID : 1,
              VehicleID : 1,
              Impressions : 1
            }
          }, function(error, impressions) {
            if (curr.mongo.is_mongo_error(res, error, impressions_query)) return;

            if (impressions) {
              for(var i = 0; i < impressions.length; i++) {
                vehicle_hash[ impressions[i].data.VehicleID ].
                  impressions.push(impressions[i]);
              }
              res.send({
                ok : true,
                vehicle_query : vehicle_query,
                impressions_query : impressions_query,
                count : count,
                note : "vehicles and impressions found",
                result : vehicles
              });
            }
            else {
              res.send({
                ok : true,
                vehicle_query : vehicle_query,
                impressions_query : impressions_query,
                count : count,
                note : "vehicles found, but no impressions",
                result : vehicles
              });
            }
          });
        })
      }
      else {
        res.send({
          ok : true,
          vehicle_query : vehicle_query,
          note : "no vehicles found with query",
          result : null
        });
      }
    });
  }
  
  
  
  
  
  
  
  this.orphan_vehicle_list = function(req, res) {
    
    var vehicle_query = input_parser.query(req.query.query);
    var sort = input_parser.sort(req.query.sort);
    var page_size = input_parser.number(req.query.pagesize);
    var page_number = input_parser.number(req.query.pagenum);

    if (!vehicle_query) {
      res.send({
        ok : false,
        query : null,
        note : "a 'query' field must be specified with valid json",
        error : "no 'query' specified"
      });
      return;
    }
    
    
    curr.vehicle_access.find({
      query : vehicle_query,
      sort : sort
    }, function(error, vehicles) {
      if (curr.mongo.is_mongo_error(res, error, vehicle_query)) return;
      
      if (vehicles) {
        var impressions_query = {'$or' : []};
        var vehicle_hash = {};
        for(var i = 0; i < vehicles.length; i++) {
          impressions_query.$or.push({VehicleID : vehicles[i].data.ID});
          vehicles[i].impressions = [];
          vehicle_hash[ vehicles[i].data.ID ] = vehicles[i];
        }
        
        curr.impression_access.find({
          query : impressions_query,
          projection : {
            _id : 0,
            VehicleID : 1
          }
        }, function(error, impressions) {
          if (curr.mongo.is_mongo_error(res, error, impressions_query)) return;

          if (impressions) {
            for(var i = 0; i < impressions.length; i++) {
              if (vehicle_hash[ impressions[i].data.VehicleID ]) {
                delete vehicle_hash[ impressions[i].data.VehicleID ];
              }
            }
            
            var actual_vehicles = [];
            for(var i = 0; i < vehicles.length; i++) {
              var vehicle = vehicles[i];
              if (vehicle_hash[ vehicle.data.ID ]) {
                actual_vehicles.push(vehicle);
              }
            }
            
            var filtered_vehciles = [];
            if (page_size !== undefined && page_number !== undefined) {
              var start = (page_size * page_number);
              var end = (start + page_size);
              if (end >= actual_vehicles.length) {
                end = actual_vehicles.length;
              }
              for(var c = start; c < end; c++) {
                filtered_vehciles.push(actual_vehicles[c]);
              }
            }
            else {
              filtered_vehciles = actual_vehicles;
            }
            
            res.send({
              ok : true,
              vehicle_query : vehicle_query,
              count : actual_vehicles.length,
              note : "vehicles and impressions found",
              result : filtered_vehciles
            });
          }
          else {
            res.send({
              ok : true,
              vehicle_query : vehicle_query,
              count : vehicles.length,
              note : "vehicles found, but no impressions",
              result : vehicles
            });
          }
        });
      }
      else {
        res.send({
          ok : true,
          vehicle_query : vehicle_query,
          note : "no vehicles found with query",
          result : null
        });
      }
    });
  }
}





