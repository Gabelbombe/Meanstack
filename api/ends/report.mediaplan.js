
var valuation = require("../helpers/valuation.js");
var demographics = require("../helpers/demographics.js");
var parser = require("../helpers/parser.js");
var logger = require("../helpers/logging.js")();
var async = require("async");

module.exports = function(app, _mongo, all_config) {
  
  var curr = this;
  this.mongo = _mongo;
  
  
  
  
  
  this.init = function() {
    var report = "setting up report endpoints: \n";
    
    
    
    var get_endpoint_1 = "/report/mediaplan/:id";
    report += (" - setup endpoint:  get "+get_endpoint_1+"\n");
    app.get(get_endpoint_1, this.mediaplan);
    
    
    logger.info(report);
  }
  
  
  
  



  this.mediaplan = function(req, res) {
    
    var mediaplan_id = req.params.id;
    var mediaplan_query = {
      '$or' : [
        { MediaPlanFriendlyId : mediaplan_id },
        { MediaPlanId : mediaplan_id }
      ]
    };
    
    // first, we have to get the mediaplan
    curr.mongo.db_collection("BenAPI", "MediaPlan").findOne(
        mediaplan_query, function(error, mediaplan) {
      if (curr.mongo.is_mongo_error(res, error, mediaplan_query)) return;    
      
      if (!mediaplan) {
        res.send({
          ok : true,
          mediaplan_query : mediaplan_query,
          note : "unable to find mediaplan",
          result : null
        });
        return;
      }
      
      if (!mediaplan.MediaPlanFriendlyId) {
        res.send({
          ok : true,
          mediaplan_query : mediaplan_query,
          note : "mediaplan does not have MediaPlanFriendlyId",
          result : null
        });
        return;
      }
      
      // start building the report object
      var report = {};
      report.mediaplan = mediaplan;
      
      // now we have to get all the placements for the media plan
      var placement_query = { MediaPlanID : mediaplan.MediaPlanFriendlyId }
      curr.mongo.db_collection("BenAPI", "Placement").find(placement_query).
          toArray(function(error, placements) {
        if (curr.mongo.is_mongo_error(res, error, placement_query)) return;   
        
        if (placements.length == 0) {
          res.send({
            ok : true,
            mediaplan_query : mediaplan_query,
            placement_query : placement_query,
            note : "mediaplan has no placements",
            result : report
          });
          return;
        }
        
        var vehicle_ids = [];
        var vehicle_query = { '$or' : [] };
        var impression_query = { '$or' : [] };
        for(var i = 0; i < placements.length; i++) {
          if (placements[i].VehicleID == null) {
            return;
          }
          if (vehicle_ids.indexOf(placements[i].VehicleID) < 0) {
            vehicle_ids.push(placements[i].VehicleID);
            vehicle_query['$or'].push({ ID : placements[i].VehicleID });
            impression_query['$or'].push({ VehicleID : placements[i].VehicleID });
          }
        }
        
        curr.mongo.db_collection("BenAPI", "Vehicle").find(vehicle_query).
            toArray(function(error, vehicles) {
          if (curr.mongo.is_mongo_error(res, error, vehicle_query)) return;  
            
//          report.placements = placements;
//          report.vehicles = vehicles;
          
          var vehicle_report = {
            TV : [],
            Film : [],
            Digital : [],
            Music : [],
            Celebrity : []
          }
          for(var i = 0; i < vehicles.length; i++) {

		  vehicles[i].placements = [];
		  vehicles[i].impressions = [];

			if (!vehicles[i].Channel) {
              continue;
            }
            vehicle_report[vehicles[i].Channel].push(vehicles[i]);

            for(var j = 0; j < placements.length; j++) {
              if (placements[j].VehicleID == vehicles[i].ID) {
                vehicles[i].placements.push(placements[j]);
              }
            }
          }
          
          
          curr.mongo.db_collection("BenAPI", "Impressions").find(impression_query).
              toArray(function(error, impressions) {
            if (curr.mongo.is_mongo_error(res, error, impression_query)) return;
            
            for(var i = 0; i < impressions.length; i++) {
              var impression = impressions[i];
              var vehicle_id = impression.VehicleID;
              for(var j = 0; j < vehicles.length; j++) {
                var vehicle = vehicles[j];
                if (vehicle_id == vehicle.ID) {
                  vehicle.impressions.push(impression);
                  impression.Demographics = demographics.group(
                              impression.Demographics, impression.Source);
                }
              }
            }
            
            var attribute_query = {
              '$or' : [
                { _id : "dictionary-placement_pricing" },
                { _id : "dictionary-placement_quality" },
                { _id : "dictionary-vehicle_power" },
                { _id : "dictionary-verbal_mention" },
              ]
            }
            curr.mongo.db_collection("BenAPI", "attribute").find(attribute_query).
                toArray(function(error, configs) {
              if (curr.mongo.is_mongo_error(res, error, attribute_query)) return;
              
              var placement_pricing = false;
              var placement_quality = false;
              var vehicle_power = false;
              var verbal_mention = false;
              for(var i = 0; i < configs.length; i++) {
                if (configs[i]._id == "dictionary-placement_pricing") {
                  placement_pricing = configs[i].data;
                }
                else if (configs[i]._id == "dictionary-placement_quality") {
                  placement_quality = configs[i].data;
                }
                else if (configs[i]._id == "dictionary-vehicle_power") {
                  vehicle_power = configs[i].data;
                }
                else if (configs[i]._id == "dictionary-verbal_mention") {
                  verbal_mention = configs[i].data;
                }
              }
              
              if (!placement_pricing || 
                  !placement_quality || 
                  !vehicle_power || 
                  !verbal_mention) {
                var error_report = {
                  ok : false,
                  note : "was not able to get all the required "+
                    "configuration for mediaplan report",
                  error : "configuration out of the attribute "+
                    "collection is missing"
                };
                logger.error(error_report);
                res.send(error_report);
                return;
              }
			  
			  async.forEach(vehicles,
				function(vehicle, async_callback) {
					curr.report_vehicle(placement_pricing, 
										vehicle_power, 
										placement_quality, 
										verbal_mention, 
										vehicle,
						function() {
							curr.accumulate_vehicle_demographics(vehicle);
							async_callback();
						});
				},
				function(error) {
				  
				  report.mediaplan_projection = {};
				  report.mediaplan_projection.channel_media_value = 
					curr.calc_projected_channel_media_value(report);
				  report.mediaplan_projection.channel_impressions =
					curr.calc_projected_channel_impressions(report);
				  report.mediaplan_projection.media_value =
					curr.calc_projected_media_value(report);
				  report.mediaplan_projection.impressions =
					curr.calc_projected_impressions(report);
				  
				  report.vehicle_report = vehicle_report;
				  report.vehicle_channel_totals = 
					curr.report_channel_totals(report);
				  
				  report.mediaplan_totals = curr.calc_mediaplan_totals(report);
				  
				  res.send({
					ok : true,
					mediaplan_query : mediaplan_query,
					placement_query : placement_query,
					vehicle_query : vehicle_query,
					impression_query : impression_query,
					attribute_query : attribute_query,
					note : "report created for mediaplan",
					result : report
				  });
				}
			  );
              
            }); /* end find for attribute */
            
          }); /* end find for impression */
          
        }); /* end find for vehicles */
        
      }); /* end find for placements */
      
    }); /* end findOne for media plan */
  }
  
  this.report_channel_totals = function(report) {
    return {
      TV : curr.report_channel_total_from_vehicles(report.vehicle_report.TV),
      Film : curr.report_channel_total_from_vehicles(report.vehicle_report.Film),
      Digital : curr.report_channel_total_from_vehicles(report.vehicle_report.Digital),
      Music : curr.report_channel_total_from_vehicles(report.vehicle_report.Music),
      Celebrity : curr.report_channel_total_from_vehicles(report.vehicle_report.Celebrity)
    };
  }
  
  this.report_channel_total_from_vehicles = function(vehicles) {
    
    var total_channel_impressions = 0;
    var total_channel_media_value = 0;
    var total_channel_demographics = [];
    
    for(var i = 0; i < vehicles.length; i++) {
      var vehicle = vehicles[i];
      
      total_channel_impressions += vehicle.total_impressions;
      total_channel_media_value += vehicle.total_media_value;
      if (vehicle.total_demographics) {
        total_channel_demographics.push(vehicle.total_demographics);
      }
    }
    
    return {
      impressions : total_channel_impressions,
      media_value : total_channel_media_value,
      demographics : demographics.collide(total_channel_demographics)
    };
  }
  
  this.calc_mediaplan_totals = function(report) {
    
    var total_impressions = 0;
    var total_media_value = 0;
    var total_demographics = [];
    
    for(var channel in report.vehicle_channel_totals) {
      var channel_total = report.vehicle_channel_totals[channel];
      
      total_impressions += channel_total.impressions;
      total_media_value += channel_total.media_value;
      if (channel_total.demographics) {
        total_demographics.push(channel_total.demographics);
      }
    }
    
    return {
      impressions : total_impressions,
      media_value : total_media_value,
      demographics : demographics.collide(total_demographics)
    };
  }
  
  this.report_vehicle = function(base_placement_pricing,
                                 vehicle_power_modifiers,
                                 placement_quality_modifiers,
                                 verbal_mention_modifiers,
                                 vehicle,
								 callback) {
    
    // first we need to find the total impressions
    if (vehicle.Channel == "Film" || vehicle.Channel == "TV") {
      var per_placement_impressions = 0;
      for(var i = 0; i < vehicle.impressions.length; i++) {
        per_placement_impressions += parseFloat(vehicle.impressions[i].Impressions);
      }
      vehicle.per_placement_impressions = per_placement_impressions;
      vehicle.total_impressions = per_placement_impressions * 
        vehicle.placements.length;
    }
    else {
      var total_impressions = 0;
      for(var i = 0; i < vehicle.placements.length; i++) {
        total_impressions += parseFloat(vehicle.placements[i].Impressions);
      }
      vehicle.per_placement_impressions = false;
      vehicle.total_impressions = total_impressions;
    }
    
    // now we value every placement and return the total
    var total_vehicle_value = 0;
	async.forEach(vehicle.placements,
		function(placement, async_callback) {
			if (vehicle.Channel === "Celebrity") {
				valuation.value_placement_celeb(
						placement,
						curr.mongo,
					function(result){
						placement.PlacementMediaValue = result;
						total_vehicle_value += parseFloat(placement.PlacementMediaValue);
						async_callback();
					});
			} 
			else {
			  var impressions = 0;
			  if (vehicle.Channel == "Film" || vehicle.Channel == "TV") {
				impressions = vehicle.total_impressions;
			  }
			  else {
				impressions = parseInt(placement.Impressions);
			  }
			  
			  placement.PlacementMediaValue = valuation.value_placement(
						  base_placement_pricing,
						  vehicle_power_modifiers,
						  placement_quality_modifiers,
						  verbal_mention_modifiers,
						  vehicle.Power,
						  placement.Channel,
						  placement.Quality,
						  placement.Duration,
						  placement.VerbalCount,
						  impressions);
			  total_vehicle_value += parseFloat(placement.PlacementMediaValue);
			  
			  async_callback();
			}
		},
		function(error) {
			vehicle.total_media_value = total_vehicle_value;
			callback();
		}
	);
  }
  
  this.accumulate_vehicle_demographics = function(vehicle) {
    
    if (vehicle.impressions.length == 0) {
      vehicle.total_demographics = false;
      return;
    }
    
    var valuating = [];
    for(var i = 0; i < vehicle.impressions.length; i++) {
      var impression = vehicle.impressions[i];
      if (!impression.Demographics) {
        continue;
      }
      
      valuating.push(impression.Demographics);
    }
    
    vehicle.total_demographics = demographics.collide(valuating);
  }
  
  this.calc_projected_channel_media_value = function(report) {
    var budget = report.mediaplan.Budget;
    var channel_mix = report.mediaplan.ChannelMix;
    
    return {
      tv : Math.round(budget * (channel_mix["Tv"] / 100)),
      film : Math.round(budget * (channel_mix["Film"] / 100)),
      digital : Math.round(budget * (channel_mix["Digital"] / 100)),
      music : Math.round(budget * (channel_mix["Music"] / 100)),
      celebrity : Math.round(budget * (channel_mix["Celebrity"] / 100))
    }
  }
  
  this.calc_projected_channel_impressions = function(report) {
    var value = report.mediaplan_projection.channel_media_value;
    var cpm = report.mediaplan.ChannelCpmOverride ? 
      report.mediaplan.ChannelCpmOverride : 
      report.mediaplan.Cpm;
    
    return {
      tv : Math.round(value["tv"] / cpm["Tv"] * 1000),
      film : Math.round(value["film"] / cpm["Film"] * 1000),
      digital : Math.round(value["digital"] / cpm["Digital"] * 1000),
      music : Math.round(value["music"] / cpm["Music"] * 1000),
      celebrity : Math.round(value["celebrity"] / cpm["Celebrity"] * 1000)
    }
  }
  
  this.calc_projected_media_value = function(report) {
    var values = report.mediaplan_projection.channel_media_value;
    return values["tv"] + 
      values["film"] + 
      values["digital"] + 
      values["music"] + 
      values["celebrity"];
  }
  
  this.calc_projected_impressions = function(report) {
    var values = report.mediaplan_projection.channel_impressions;
    return values["tv"] + 
      values["film"] + 
      values["digital"] + 
      values["music"] + 
      values["celebrity"];
  }
  
}





