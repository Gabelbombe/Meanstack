
var parser = require("./parser.js");


var input_to_modifier = function(input) {
  return 2 * (input*input);
}

var valuation_round = function(input) {
  return Math.round(input * 100) / 100
}

module.exports.value_placement_celeb = function(placement, mongo, callback)
{
	console.log("here!");
	if (placement.EpisodeID) {
		var query = {VehicleID : placement.EpisodeID}
		var projection = {Impressions : 1}
		mongo.db_collection("BenAPI", "Impressions").find(query, projection).
			toArray(function(error, impressions) {
				if (error) throw error;
				
				var total_impressions = 0;
				if (impressions) {
					impressions.forEach(function(impression) {
						total_impressions += parseFloat(impression.Impressions);
					});
				}
				callback(parseFloat(placement.CPM) * 
							parseFloat(total_impressions) / 1000);
			});
	}
	else {
		callback(parseFloat(placement.CPM) * 
					parseFloat(placement.Impressions) / 1000);
	}
}

module.exports.value_placement = function(base_placement_pricing,
                                          vehicle_power_modifiers,
                                          placement_quality_modifiers,
                                          verbal_mention_modifiers,
                                          vehicle_power,
                                          placement_channel,
                                          placement_quality,
                                          placement_duration,
                                          placement_verbalcount,
                                          total_impressions)
{
//  console.log(arguments);
  if (!base_placement_pricing || 
      !vehicle_power_modifiers || 
      !placement_quality_modifiers || 
      !verbal_mention_modifiers || 
      !vehicle_power || 
      !placement_channel || 
      !placement_quality || 
      !placement_duration || 
      !placement_verbalcount || 
      !total_impressions) {
    return 0;
  }
  
  // first we get all of the modifiers from the configuration
  var base_placement_modifier = 
    base_placement_pricing[placement_channel];
  var vehicle_power_modifier = 
    input_to_modifier(vehicle_power_modifiers[vehicle_power]);
  var placement_quality_modifier = 
    input_to_modifier(placement_quality_modifiers[placement_quality]);
  var verbal_mention_quality_modifier = 
    input_to_modifier(placement_quality_modifiers[verbal_mention_modifiers["PlacementQuality"]]);
  
  // now we figure out the modifier for duration and verbal mentions
  var placement_duration_modifier = (function(){
    var total_duration = parser.duration(placement_duration);
    
    if (total_duration > 120) {
      total_duration = 120;
    }
    if (total_duration == 0) {
      return 0;
    }
    
    return (0.4 * Math.log(total_duration)) + 0.078;
  })();
  var placement_verbal_mentions_modifier = (function(){
    var total_duration = 0;
    if (placement_verbalcount) {
      var verbal_mentions_modifier = parser.duration(
              verbal_mention_modifiers["Duration"]);
      total_duration += (placement_verbalcount * verbal_mentions_modifier);
    }
    
    if (total_duration > 120) {
      total_duration = 120;
    }
    if (total_duration == 0) {
      return 0;
    }
    
    return (0.4 * Math.log(total_duration)) + 0.078;
  })();
  
  vehicle_power_modifier = valuation_round(vehicle_power_modifier);
  placement_quality_modifier = valuation_round(placement_quality_modifier);
  placement_duration_modifier = valuation_round(placement_duration_modifier);
  placement_verbal_mentions_modifier = valuation_round(placement_verbal_mentions_modifier);
  
  // total modifier for impressions
  var impression_modifier = 
    (base_placement_modifier * 
     vehicle_power_modifier *
     placement_quality_modifier *
     placement_duration_modifier) + 
    (base_placement_modifier * 
     vehicle_power_modifier *
     verbal_mention_quality_modifier *
     placement_verbal_mentions_modifier);

  return Math.round(impression_modifier * total_impressions / 1000);
}
