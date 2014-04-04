
var valuation = require("../helpers/valuation.js");
var validate = require("../helpers/validate.js");
var async = require("async");



var brand = {
  "BrandId" : {
    datatype : "number",
    validate : validate.always
  },
  "BrandName" : {
    datatype : "string",
    validate : validate.always
  },
  "ClientId" : {
    datatype : "number",
    validate : validate.always
  },
  "Categories" : {
    datatype : "any"
  },
  "ClientName" : {
    datatype : "string",
    validate : validate.always
  },
  "Status" : {
    datatype : "string",
    validate : validate.always
  },
  "LogoUrl" : {
    datatype : "string",
    validate : validate.always
  }
}

var account = {
  "AccountId" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Brands" : {
    datatype : "object",
    object_def : brand
  },
  "FirstName" : {
    datatype : "string",
    validate : validate.not_null
  },
  "LastName" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Email" : {
    datatype : "string",
    validate : validate.not_null
  },
  "MustChangePassword" : {
    datatype : "bool",
    validate : validate.not_null
  },
  "HasAcceptedWebsiteTerms" : {
    datatype : "bool",
    validate : validate.not_null
  },
  "AccountFlags" : {
    datatype : "any"
  },
  "Role" : {
    datatype : "number",
    validate : validate.not_null
  }
}

var mediaplan_definition = {
  "MediaPlanId" : {
    datatype : "string",
    validate : validate.not_null
  },
  "MediaPlanFriendlyId" : {
    datatype : "string",
    validate : validate.not_null
  },
  "PlanStatus" : {
    datatype : "string",
    validate : validate.not_null
  },
  "ProjectGoal" : {
    datatype : "string",
    validate : validate.always
  },
  "ProjectName" : {
    datatype : "string",
    validate : validate.always
  },
  "Budget" : {
    datatype : "string",
    validate : validate.not_null
  },
  "DateRange" : {
    datatype : "object",
    object_def : {
      "Start" : {
        datatype : "date",
        validate : validate.always
      },
      "End" : {
        datatype : "date",
        validate : validate.always
      }
    }
  },
  
  
  "Brand" : {
    datatype : "number",
    validate : validate.not_null
  },
  
  
  "Categories" : {
    datatype : "array",
    object_def : {
      "Id" : {
        datatype : "string",
        validate : validate.not_null
      },
      "Name" : {
        datatype : "string",
        validate : validate.not_null
      }
    }
  },
  
  
  "Client" : {
    datatype : "object",
    object_def : {
      "Id" : {
        datatype : "string",
        validate : validate.not_null
      },
      "Name" : {
        datatype : "string",
        validate : validate.not_null
      }
    }
  },
  
  
  "Filters" : {
    "RatingLimit" : {
      datatype : "array",
      object_def : {
        datatype : "string",
        validate : validate.not_null
      }
    },
    "FilmGenres" : {
      datatype : "array",
      object_def : {
        datatype : "string",
        validate : validate.not_null
      }
    },
    "MusicGenres" : {
      datatype : "array",
      object_def : {
        datatype : "string",
        validate : validate.not_null
      }
    },
    "AVehicleOnly" : {
      datatype : "bool",
      validate : validate.not_null
    }
  },
  
  
  "ChannelMix" : {
    datatype : "object",
    object_def : {
      "Tv" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Film" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Digital" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Music" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Celebrity" : {
        datatype : "number",
        validate : validate.not_null
      }
    }
  },
  "Cpm" : {
    datatype : "object",
    object_def : {
      "Tv" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Film" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Digital" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Music" : {
        datatype : "number",
        validate : validate.not_null
      },
      "Celebrity" : {
        datatype : "number",
        validate : validate.not_null
      }
    }
  },
  
  
  "PrimaryContact" : {
    datatype : "object",
    object_def : account
  },
  
  
  "AdditionalContacts" : {
    datatype : "array",
    object_def : account
  },
  
  
  "WishlistOpportunities" : {
    datatype : "array",
    object_def : {
      datatype : "string",
      validate : validate.not_null
    }
  },
  
  
  "ExcludedOpportunities" : {
    datatype : "array",
    object_def : {
      datatype : "string",
      validate : validate.not_null
    }
  },
  
  
  "BrandReadyOpportunities" : {
    datatype : "array",
    object_def : {
      datatype : "string",
      validate : validate.not_null
    }
  },
  
  
  "TargetSegments" : {
    datatype : "array",
    object_def : {
      "FamilyOriented" : {
        datatype : "bool",
        validate : validate.not_null
      },
      "Gender" : {
        datatype : "array",
        object_def : {
          datatype : "string",
          validate : validate.not_null
        }
      },
      "Ethnicity" : {
        datatype : "array",
        object_def : {
          datatype : "string",
          validate : validate.not_null
        }
      },
      "Nickname" : {
        datatype : "string",
        validate : validate.not_null
      },
      "IsPrimary" : {
        datatype : "bool",
        validate : validate.not_null
      },
      "IsChildrenInHousehold" : {
        datatype : "bool",
        validate : validate.not_null
      },
      "AgeRange" : {
        datatype : "object",
        object_def : {
          "Start" : {
            datatype : "number",
            validate : validate.not_null
          },
          "End" : {
            datatype : "number",
            validate : validate.not_null
          }
        }
      },
      "IncomeRange" : {
        datatype : "object",
        object_def : {
          "Start" : {
            datatype : "number",
            validate : validate.not_null
          },
          "End" : {
            datatype : "number",
            validate : validate.not_null
          }
        }
      }
    }
  }
};



var BaseMongo = require("./base_mongo.js");

var _mongo;
var _logger;
var _config;
function MediaPlanDAO(mongo, logger, config) {
  BaseMongo.call(this, mongo, 
                       logger, 
                       config.access.mediaplan, 
                       mediaplan_definition);
  _mongo = mongo;
  _logger = logger;
  _config = config;
}



MediaPlanDAO.prototype = new BaseMongo();
MediaPlanDAO.prototype.constructor = MediaPlanDAO;



MediaPlanDAO.prototype._find_one_query = function(id){
  return {
    '$or' : [
      { MediaPlanId : id },
      { MediaPlanFriendlyId : id }
    ]
  }
};

MediaPlanDAO.prototype.reference = function(object, callback) {
  var self = this;
  object.references = {};
  async.parallel([
    function(async_callback){
      if (!object.data.Brand) { async_callback(); return; }
      
      self.mongo.db_collection("BenAPI", "Brand").findOne(
        {BrandId : object.data.Brand}, 
        function(error, brand){
          if (error) { async_callback(error); return; }
          object.references.Brand = brand;
          async_callback();
        });
    },
    function(async_callback){
      if (!object.data.WishlistOpportunities ||
          object.data.WishlistOpportunities.length <= 0) { 
        async_callback(); return; 
      }
      
      var query = {'$or' : []};
      object.data.WishlistOpportunities.forEach(function(element){
        query['$or'].push({OpportunityId : element});
      });
//      logger.debug(query);
      self.mongo.db_collection("BenAPI", "Opportunity").find(query).toArray(
        function(error, opportunities){
          if (error) { async_callback(error); return; }
          object.references.WishlistOpportunities = opportunities;
          async_callback();
        });
    },
    function(async_callback){
      if (!object.data.ExcludedOpportunities ||
          object.data.ExcludedOpportunities.length <= 0) { 
        async_callback(); return; 
      }
      
      var query = {'$or' : []};
      object.data.ExcludedOpportunities.forEach(function(element){
        query['$or'].push({OpportunityId : element});
      });
      self.mongo.db_collection("BenAPI", "Opportunity").find(query).toArray(
        function(error, opportunities){
          if (error) { async_callback(error); return; }
          object.references.ExcludedOpportunities = opportunities;
          async_callback();
        });
    },
    function(async_callback){
      if (!object.data.BrandReadyOpportunities ||
          object.data.BrandReadyOpportunities.length <= 0) { 
        async_callback(); return; 
      }
      
      var query = {'$or' : []};
      object.data.BrandReadyOpportunities.forEach(function(element){
        query['$or'].push({OpportunityId : element});
      });
      self.mongo.db_collection("BenAPI", "Opportunity").find(query).toArray(
        function(error, opportunities){
          if (error) { async_callback(error); return; }
          object.references.BrandReadyOpportunities = opportunities;
          async_callback();
        });
    },
  ], 
  function(finished_error){
    callback(finished_error, object);
  });
}

MediaPlanDAO.prototype.calculate = function(object, callback) {
  object.calculated = {};
  async.parallel([
    // find the actual impressions... :(
    // to do that, we get all of the placements and then
    // just add them up at the end.
    function(async_callback) {
      
      var placement_dao = new (require("./placement.js"))(_mongo, _logger, _config);
      placement_dao.find(
        {query : {MediaPlanID : object.data.MediaPlanFriendlyId}}, 
        function(error, placements) {
          if (error) { async_callback(error); return; }
//          object.calculated.placements = placements;
//          console.log("query");
//          console.log(object.data.MediaPlanFriendlyId);
//          console.log({MediaPlanID : object.data.MediaPlanFriendlyId});
          
          var total_impressions = 0;
          var total_media_value = 0;
          if (placements) {
            placements.forEach(function(placement) {
//              console.log(placement.data.PlacementId);
//              console.log(placement.data.VehicleID);
//              console.log(placement.data.MediaPlanID);
//              console.log(placement.calculated);
              total_impressions += placement.calculated.impressions;
              total_media_value += placement.calculated.media_value;
            });
          }
          
          object.calculated.actual = {
            impressions : total_impressions,
            media_value : total_media_value
          }
          
          async_callback();
        });
    },
    
    // lets calculate the projected values
    function(async_callback) {
      var budget = object.data.Budget;
      var channel_mix = object.data.ChannelMix;
      var cpm = object.data.ChannelCpmOverride ? 
        object.data.ChannelCpmOverride : object.data.Cpm;
      if (!budget || !channel_mix || !cpm) { async_callback(); return; }
      
      var projected_channel_media_value = {
        tv : Math.round(budget * (channel_mix["Tv"] / 100)),
        film : Math.round(budget * (channel_mix["Film"] / 100)),
        digital : Math.round(budget * (channel_mix["Digital"] / 100)),
        music : Math.round(budget * (channel_mix["Music"] / 100)),
        celebrity : Math.round(budget * (channel_mix["Celebrity"] / 100))
      }
      var projected_channel_impressions = {
        tv : Math.round(projected_channel_media_value["tv"] / 
          cpm["Tv"] * 1000),
        film : Math.round(projected_channel_media_value["film"] /
          cpm["Film"] * 1000),
        digital : Math.round(projected_channel_media_value["digital"] / 
          cpm["Digital"] * 1000),
        music : Math.round(projected_channel_media_value["music"] /
          cpm["Music"] * 1000),
        celebrity : Math.round(projected_channel_media_value["celebrity"] / 
          cpm["Celebrity"] * 1000)
      }
      var projected_media_value = 
                projected_channel_media_value["tv"] + 
                projected_channel_media_value["film"] + 
                projected_channel_media_value["digital"] + 
                projected_channel_media_value["music"] + 
                projected_channel_media_value["celebrity"];
      var projected_impressions = 
                projected_channel_impressions["tv"] + 
                projected_channel_impressions["film"] + 
                projected_channel_impressions["digital"] + 
                projected_channel_impressions["music"] + 
                projected_channel_impressions["celebrity"];
      
      object.calculated.projected = {
        channel_media_value : projected_channel_media_value,
        channel_impressions : projected_channel_impressions,
        media_value : projected_media_value,
        impressions : projected_impressions
      }
      
      
      async_callback();
    },
  ], 
  function(finished_error){
    callback(finished_error, object);
  });
}

MediaPlanDAO.prototype.ensure_indexes = function() {
  
}

module.exports = MediaPlanDAO;

