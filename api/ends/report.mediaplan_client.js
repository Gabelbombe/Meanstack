
var valuation = require("../helpers/valuation.js");
var demographics = require("../helpers/demographics.js");
var parser = require("../helpers/parser.js");
var logger = require("../helpers/logging.js")();

module.exports = function(app, _mongo, all_config) {
  
  var curr = this;
  this.mongo = _mongo;
  
  
  
  
  
  this.init = function() {
    var report = "setting up report endpoints: \n";
    
    
    
    var get_endpoint_1 = "/report/mediaplan_client/:id";
    report += (" - setup endpoint:  get "+get_endpoint_1+"\n");
    app.get(get_endpoint_1, this.mediaplan_client);
    
    
    logger.info(report);
  }
  
  
  
  



  this.mediaplan_client = function(req, res) {
    
    var client_id = req.params.id;
    var mediaplan_query = {
      'Client.Id' : client_id,
      'PlanStatus': {
        '$in': [
          4,
          5,
          6
        ]
      }
    };
    
    
    var mediaplan_dao = new (require("../dao/mediaplan.js"))(_mongo, 
                                                             logger,
                                                             all_config);
    
    mediaplan_dao.find({query : mediaplan_query}, 
    function(error, mediaplans) {
      if (curr.mongo.is_mongo_error(res, error, mediaplan_query)) return;   
      
      
      res.send({
        ok : true,
        query : mediaplan_query,
        note : "found documents",
        result : mediaplans
      });
    });
  }
  
  
  
}


