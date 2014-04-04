
var validate = require("../helpers/validate.js");

var demographic = {
  "IsMarketBreakAgnostic" : {
    datatype : "bool",
    validate : validate.always
  },
  "Gender" : {
    datatype : "string",
    validate : validate.always
  },
  "AgeMin" : {
    datatype : "number",
    validate : validate.always
  },
  "AgeMax" : {
    datatype : "number",
    validate : validate.always
  },
  "IncomeMin" : {
    datatype : "number",
    validate : validate.always
  },
  "IncomeMax" : {
    datatype : "number",
    validate : validate.always
  },
  "Race" : {
    datatype : "string",
    validate : validate.always
  },
  "HaveChildren_03to13" : {
    datatype : "bool",
    validate : validate.always
  },
  "HaveChildren_00to06" : {
    datatype : "bool",
    validate : validate.always
  },
  "HaveChildren_07to11" : {
    datatype : "bool",
    validate : validate.always
  },
  "HaveChildren_12to17" : {
    datatype : "bool",
    validate : validate.always
  },
  "Impressions" : {
    datatype : "number",
    validate : validate.not_null
  }
}


var segment = {
  "ID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Households" : {
    datatype : "number",
    validate : validate.not_null
  },
  "Demographics" : {
    datatype : "array",
    object_def : demographic
  }
}


var impression_definition = {
  "ID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Source" : {
    datatype : "string",
    validate : validate.not_null
  },
  "Channel" : {
    datatype : "string",
    validate : validate.channel
  },
  "VehicleID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "ProgramID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "TrackageID" : {
    datatype : "string",
    validate : validate.not_null
  },
  "EpisodeID" : {
    datatype : "string",
    validate : validate.not_null
  },
  
  
  "DateAdded" : {
    datatype : "date",
    validate : validate.not_null
  },
  "AddedBy" : {
    datatype : "string",
    validate : validate.not_null
  },
  "DateModified" : {
    datatype : "date",
    validate : validate.not_null
  },
  "ModifiedBy" : {
    datatype : "string",
    validate : validate.not_null
  },
  
  
  "Start" : {
    datatype : "date",
    validate : validate.not_null
  },
  "End" : {
    datatype : "date",
    validate : validate.not_null
  },
  
  
  "ProgramName" : {
    datatype : "string",
    validate : validate.not_null
  },
  "TrackageName" : {
    datatype : "string",
    validate : validate.always
  },
  "EpisodeName" : {
    datatype : "string",
    validate : validate.always
  },
  "EpisodeNumber" : {
    datatype : "string",
    validate : validate.always
  },
  "Network" : {
    datatype : "string",
    validate : validate.always
  },
  "TelecastNumber" : {
    datatype : "string",
    validate : validate.always
  },
  
  
  "Impressions" : {
    datatype : "number",
    validate : validate.not_null
  },
  "Households" : {
    datatype : "string",
    validate : validate.always
  },
  "USBoxOfficeSales" : {
    datatype : "string",
    validate : validate.always
  },
  "USTheaters" : {
    datatype : "string",
    validate : validate.always
  },
  "WeeksInTotal" : {
    datatype : "string",
    validate : validate.always
  },
  
  
  "FifteenMinuteSegments" : {
    datatype : "array",
    object_def : segment
  },
  "Demographics" : {
    datatype : "array",
    object_def : demographic
  }
};



var BaseMongo = require("./base_mongo.js");

function ImpressionDAO(mongo, logger, config) {
  BaseMongo.call(this, mongo, 
                       logger, 
                       config.access.impression, 
                       impression_definition);
}



ImpressionDAO.prototype = new BaseMongo();
ImpressionDAO.prototype.constructor = ImpressionDAO;



module.exports = ImpressionDAO;
