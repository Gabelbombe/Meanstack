
var config = require("../findconfig.js");
var package_object = require("./error.js");
var logger = require("./logging.js")();

var MongoClient = require('mongodb');
var mongo_client = undefined;



module.exports.ready = function() {
  return (mongo_client != undefined);
}

module.exports.is_mongo_ready = function(res) {
  if (!module.exports.ready()) {
    var report = {
      ok : false,
      note : "mongo is not ready or is in error",
      error_type : "MongoError",
      error : "mongo is not initialized"
    };
    logger.error(report);
    res.send(report);
    return false;
  }
  return true;
}

module.exports.is_mongo_error = function(res, error, query) {
  if (error) {
    // no!!!!!!!!
    var report = {
      ok : false,
      query : query,
      note : "error during mongo call",
      error : package_object(error)
    };
    logger.error(report);
    res.send(report);
    return true;
  }
  return false;
}

module.exports.db_collection = function(db_name, coll_name) {
  return mongo_client.db(db_name).collection(coll_name);
}



// finally, we go ahead and connect
require('mongodb').connect(config.mongo.connection, function(err, db) {
  if(err) throw err;

  logger.info("connected to mongo with: \n"+config.mongo.connection);
  
  // finally, we export signal that the db is ready
  mongo_client = db;
})
