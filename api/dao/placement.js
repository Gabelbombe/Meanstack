
var async = require("async");
var valuation = require("../helpers/valuation.js");
var validate = require("../helpers/validate.js");
var parser = require("../helpers/parser.js");
var error_pak = require("../helpers/error.js");

var placement_definition = {
  
  "PlacementId" : {
    datatype : "number",
    validate : validate.not_null
  },
  "VehicleID" : {
    datatype : "string",
    validate : validate.always
  },
  "Channel" : {
    datatype : "string",
    validate : validate.channel
  },
  "AirDate" : {
    datatype : "date",
    validate : validate.not_null
  },
  "Impressions" : {
    datatype : "number",
    validate : validate.not_null
  },
  "MediaPlanID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Description" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Duration" : {
    datatype : "string",
    validate : validate.not_null
  },
  "EpisodeNumberSEQ" : {
    datatype : "string",
    validate : validate.always
  },
  "Network" : {
    datatype : "string",
    validate : validate.always
  },
  "PlacementName" : {
    datatype : "string",
    validate : validate.not_null
  },
  "ProductionTitle" : {
    datatype : "string",
    validate : validate.always
  },
  "Quality" : {
    datatype : "string",
    validate : validate.quality
  },
  "QualityPPS" : {
    datatype : "string",
    validate : validate.always
  },
  "Repeat" : {
    datatype : "bool",
    validate : validate.always
  },
  "SeasonNumber" : {
    datatype : "string",
    validate : validate.always
  },
  "StartTime" : {
    datatype : "string",
    validate : validate.always
  },
  
  
  "ClipUrl" : {
    datatype : "string",
    validate : validate.always
  },
  "StillImageUrl" : {
    datatype : "string",
    validate : validate.always
  },
  "ThumbNail" : {
    datatype : "string",
    validate : validate.always
  },
  "FullSize" : {
    datatype : "string",
    validate : validate.always
  },
  "Movie" : {
    datatype : "string",
    validate : validate.always
  },
  "ThumbNailUrl" : {
    datatype : "string",
    validate : validate.always
  },
  
  
  "CreatedBy" : {
    datatype : "string",
    validate : validate.not_null
  },
  "CreateDate" : {
    datatype : "date",
    validate : validate.always
  },
  "CreateDateTime" : {
    datatype : "date",
    validate : validate.not_null
  },
  "UpdateBy" : {
    datatype : "string",
    validate : validate.not_null
  },
  "UpdateDate" : {
    datatype : "date",
    validate : validate.always
  },
  "UpdateDateTime" : {
    datatype : "date",
    validate : validate.not_null
  },
  
  "BrandId" : {
    datatype : "number",
    validate : validate.not_null
  },
  "BrandName" : {
    datatype : "string",
    validate : validate.not_null
  },
  "ClientId" : {
    datatype : "number",
    validate : validate.not_null
  },
  "ClientName" : {
    datatype : "string",
    validate : validate.not_null
  },
  
  "VehicleCoverImageURL" : {
    datatype : "string",
    validate : validate.always
  },
  "VehicleVideoClipUrl" : {
    datatype : "string",
    validate : validate.always
  },
  "VehicleName" : {
    datatype : "string",
    validate : validate.always
  },
  "VehicleNumber" : {
    datatype : "string",
    validate : validate.always
  },
  "VehicleParentID" : {
    datatype : "string",
    validate : validate.always
  },
  "VehicleParentName" : {
    datatype : "string",
    validate : validate.always
  },
  "VehiclePower" : {
    datatype : "string",
    validate : validate.always
  },
  "VerbalCount" : {
    datatype : "string",
    validate : validate.always
  },
  
  "Outlet" : {
    datatype : "string",
    validate : validate.always
  },
  "OutletType" : {
    datatype : "string",
    validate : validate.always
  },
  
  "PlacementImages" : {
    datatype : "array",
    object_def : {
      "URL" : {
        datatype : "string",
        validate : validate.always
      },
      "Location" : {
        datatype : "string",
        validate : validate.always
      },
      "Size" : {
        datatype : "string",
        validate : validate.always
      },
      "IsMain" : {
        datatype : "bool",
        validate : validate.always
      }
    }
  },
  
  "VehicleAttributes" : {
    datatype : "any"
  }
};



var BaseMongo = require("./base_mongo.js");

var _mongo;
var _logger;
var _config;
function PlacementDAO(mongo, logger, config) {
  BaseMongo.call(this, mongo, 
                       logger, 
                       config.access.placement, 
                       placement_definition);
  _mongo = mongo;
  _logger = logger;
  _config = config;
}



PlacementDAO.prototype = new BaseMongo();
PlacementDAO.prototype.constructor = PlacementDAO;



PlacementDAO.prototype._find_one_query = function(id){
  return {PlacementId : id}
}



PlacementDAO.prototype.calculate_all = function(placements, callback) {
//  console.log(placements);
  var configs = {};
  var vehicles = {};
  var impressions = {};
  async.parallel([
    
    // getting configs
    function(async_callback1) {
      var attribute_dao = new (require("./attribute.js"))(_mongo, _logger, _config);
      attribute_dao.get_config([
        "placement_pricing",
        "placement_quality",
        "vehicle_power",
        "verbal_mention",
      ],
      function(error, _configs) {
        if (error) { async_callback1(error); return; }
        configs = _configs;
        async_callback1();
      })
    },
    
    // gets all vehicles
    function(async_callback2) {
      var vehicle_ids = [];
      var vehicle_query = {'$or':[]};
      placements.forEach(function(placement){
        if (vehicle_ids.indexOf(placement.data.VehicleID) == -1) {
          vehicle_ids.push(placement.data.VehicleID);
          vehicle_query.$or.push({ID : placement.data.VehicleID});
        }
      });
      
      if (vehicle_ids.length == 0) {
        async_callback2();
        return;
      }
      
      var vehicle_dao = new (require("./vehicle.js"))(_mongo, _logger, _config);
      vehicle_dao.find({
        query : vehicle_query, 
        projection : {Power : 1, ID : 1}
      }, 
      function(error, _vehicles) {
        if (error) { async_callback2(error); return; }

        if (_vehicles) {
          _vehicles.forEach(function(vehicle) {
            vehicles[vehicle.data.ID] = vehicle;
          });
        }
        async_callback2();
      });
    },
    
    // get all impressions
    function(async_callback3) {
      var vehicle_ids = [];
      var impression_query = {'$or':[]};
      placements.forEach(function(placement){
        if (placement.data.Channel != "TV" && 
            placement.data.Channel != "Film") {
          return;
        }
        if (vehicle_ids.indexOf(placement.data.VehicleID) == -1) {
          vehicle_ids.push(placement.data.VehicleID);
          impression_query.$or.push({VehicleID : placement.data.VehicleID});
        }
      });
      
      if (vehicle_ids.length == 0) {
        async_callback3();
        return;
      }
      
//      console.log(impression_query);
      var impressions_dao = new (require("./impression.js"))(_mongo, _logger, _config);
      impressions_dao.find({
        query : impression_query,
        projection : {Impressions : 1, VehicleID : 1}
      }, function(error, _impressions) {
          if (error) { console.log(error_pak(error)); async_callback3(error); return; }
          impressions = {};
          if (_impressions) {
            _impressions.forEach(function(impression) {
              if (!impressions[impression.data.VehicleID]) {
                impressions[impression.data.VehicleID] = [];
              }
              impressions[impression.data.VehicleID].push(impression);
            });
          }
          async_callback3();
        });
    }
  ], 
  function(last_error) {
//    console.log("callback");
    if (last_error) { callback(last_error, null); return; }
    
    placements.forEach(function(placement) {
      placement.calculated = {};
      var vehicle = vehicles[placement.data.VehicleID];
      
      if (vehicle) {
        placement.calculated.impressions = 0;
        if (placement.data.Channel == "TV" || placement.data.Channel == "Film") {
          if (impressions[placement.data.VehicleID]) {
            impressions[placement.data.VehicleID].forEach(function(impression) {
              placement.calculated.impressions += impression.data.Impressions;
            });
          }
        }
        else {
          placement.calculated.impressions = parseInt(placement.data.Impressions);
        }

        placement.calculated.media_value = valuation.value_placement(
                        configs["placement_pricing"],
                        configs["vehicle_power"],
                        configs["placement_quality"],
                        configs["verbal_mention"],
                        vehicle.data.Power,
                        placement.data.Channel,
                        placement.data.Quality,
                        placement.data.Duration,
                        placement.data.VerbalCount,
                        placement.calculated.impressions);
      }
      else {
        placement.calculated.impressions = 0;
        placement.calculated.media_value = 0;
      }
    });
    
    callback(null, placements);
  });
}



PlacementDAO.prototype.calculate = function(object, callback) {
  var self = this;
  object.calculated = {};
  // first lets get the configuration
  var attribute_dao = new (require("./attribute.js"))(_mongo, _logger, _config);
  attribute_dao.get_config([
    "placement_pricing",
    "placement_quality",
    "vehicle_power",
    "verbal_mention",
  ],
  function(error, configs) {
    if (error) { callback(error, null); return; }
    
    // now lets get the vehicle
    self.mongo.db_collection("BenAPI", "Vehicle").findOne(
      {ID : object.data.VehicleID}, 
      function(error, vehicle) {
        if (error) { callback(error, null); return; }
        
        if (!vehicle) {
          object.calculated.impressions = 0;
          object.calculated.media_value = 0;
          callback(null, object);
          return;
        }
        
        var caluclate_media_value_callback = function() {
		  if (object.data.Channel == "Celebrity") {
			valuation.value_placement_celeb(object.data, self.mongo, 
				function(value) {
					object.calculated.media_value = value;
					callback(null, object);
				});
		  }
		  else {
			  object.calculated.media_value = valuation.value_placement(
						  configs["placement_pricing"],
						  configs["vehicle_power"],
						  configs["placement_quality"],
						  configs["verbal_mention"],
						  vehicle.Power,
						  object.data.Channel,
						  object.data.Quality,
						  object.data.Duration,
						  object.data.VerbalCount,
						  object.calculated.impressions);
			  callback(null, object);
		  }
        }
        
        // now we have to get the impressions.. this means that if
        // the channel is one thing, then we do the calculation based
        // on the placement, otherwise we do it with Impressions
        if (object.data.Channel == "TV" || 
            object.data.Channel == "Film") {
          // so we have to get all of the impressions
          var impression_query = {VehicleID : object.data.VehicleID};
          self.mongo.db_collection("BenAPI", "Impressions").find(impression_query).
              toArray(function(error, impressions) {
            if (error) { callback(error, null); return; }
            
            object.calculated.impressions = 0;
            if (impressions) {
              impressions.forEach(function(impression) {
                object.calculated.impressions += impression.Impressions;
              });
            }
            caluclate_media_value_callback();
          });
        }
        else {
          object.calculated.impressions = parser.number(object.data.Impressions);
          caluclate_media_value_callback();
        }
      });
  });
}

module.exports = PlacementDAO;

