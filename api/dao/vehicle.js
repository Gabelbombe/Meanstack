
var validate = require("../helpers/validate.js");

var vehicle_definition = {
  "ID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "ParentID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Name" : {
    datatype : "string",
    validate : validate.not_null
  },
  "ParentName" : {
    datatype : "string",
    validate : validate.not_null
  },
  "CreatedBy" : {
    datatype : "string",
    validate : validate.not_null
  },
  "CreatedDateTime" : {
    datatype : "date",
    validate : validate.not_null
  },
  "ModifiedBy" : {
    datatype : "string",
    validate : validate.not_null
  },
  "ModifiedDateTime" : {
    datatype : "date",
    validate : validate.not_null
  },
  "WebAccessible" : {
    datatype : "bool",
    validate : validate.not_null
  },
  
  
  
  "AirDate" : {
    datatype : "date",
    validate : validate.not_null
  },
  "Channel" : {
    datatype : "string",
    validate : validate.channel
  },
  "CoverImageURL" : {
    datatype : "string",
    validate : validate.always
  },
  "VideoClipURL" : {
    datatype : "string",
    validate : validate.always
  },
  "Description" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Power" : {
    datatype : "string",
    validate : validate.power
  },
  "EpisodeNumber" : {
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
  "Network" : {
    datatype : "string",
    validate : validate.always
  },
  "SeasonNumber" : {
    datatype : "string",
    validate : validate.always
  }
  
//  "someobject" : {
//    datatype : "object",
//    object_def : {
//      
//    }
//  }
};



var BaseMongo = require("./base_mongo.js");

function VehicleDAO(mongo, logger, config) {
  BaseMongo.call(this, mongo, 
                       logger, 
                       config.access.vehicle, 
                       vehicle_definition);
}



VehicleDAO.prototype = new BaseMongo();
VehicleDAO.prototype.constructor = VehicleDAO;



VehicleDAO.prototype.ensure_indexes = function() {
  this._coll().ensureIndex({ID : 1});
  this._coll().ensureIndex({ParentID : 1});
  this._coll().ensureIndex({Name : 1});
  this._coll().ensureIndex({ParentName : 1});
  this._coll().ensureIndex({CreatedDateTime : 1});
  this._coll().ensureIndex({ModifiedDateTime : 1});
  this._coll().ensureIndex({WebAccessible : 1});
  this._coll().ensureIndex({AirDate : 1});
  this._coll().ensureIndex({Channel : 1});
}



module.exports = VehicleDAO;
