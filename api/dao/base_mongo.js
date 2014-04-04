
var async = require("async");
var validate = require("../helpers/validate.js");
var package_error = require("../helpers/error.js");


function BaseMongo(mongo, logger, config, definition) {
  this.collection = undefined;
  this.config     = config;
  this.definition = definition;
  this.mongo      = mongo;
  this.logger     = logger;
}



BaseMongo.prototype.find = function(request, callback) {
  var query = (request.query ? request.query : {});
  var projection = (request.projection ? request.projection : {});
  var options = (request.options ? request.options : {});
  var cursor = this._coll().find(query, projection, options);
  if (request.sort) {
    cursor.sort(request.sort);
  }
  
  var self = this;
  cursor.toArray(function(error, documents) {
    if (error) {
      callback(error, null);
      return;
    }

    if (documents) {
      var results = [];
      documents.forEach(function(document) {
        results.push({data : document});
      })
      self.reference_all(results, function(error) {
        if (error) { callback(error, null); return; }

        self.calculate_all(results, function(error){
          if (error) { callback(error, null); return; }

          callback(null, results);
        });
      });
    }
    else {
      callback(null, null);
    }
  });
}



BaseMongo.prototype.find_one = function(id, projection, callback) {
  if (!projection) projection = {};
  
  var query = this._find_one_query(id);
  
  var self = this;
  this._coll().findOne(query, projection, function(error, document) {
    if (error) {
      callback(error, null);
      return;
    }

    if (document) {
      var result = {data : document};
      self.reference(result, function(error) {
        if (error) { callback(error, null); return; }

        self.calculate(result, function(error){
          if (error) { callback(error, null); return; }

          callback(null, result);
        });
      });
    }
    else {
      callback(error, document);
    }
  });
}



BaseMongo.prototype.find_and_remove = function(id, callback) {
  var query = this._find_one_query(id);
  
  var self = this;
  this._coll().findAndRemove(query, function(error, document){
    if (error) {
      callback(error, null);
      return;
    }

    if (document) {
      var result = {data : document};
      self.reference(result, function(error) {
        if (error) { callback(error, null); return; }

        self.calculate(result, function(error){
          if (error) { callback(error, null); return; }

          callback(null, result);
        });
      });
    }
    else {
      callback(error, document);
    }
  });
}



BaseMongo.prototype.find_and_update = function(id, update, callback) {
  var query = this._find_one_query(id);
  var actual_update = validate.update(update, this.definition);
  
  var self = this;
  this._coll().findAndModify(query, actual_update, function(error, document){
    if (error) {
      callback(error, null);
      return;
    }

    if (document) {
      var result = {data : document};
      self.reference(result, function(error) {
        if (error) { callback(error, null); return; }

        self.calculate(result, function(error){
          if (error) { callback(error, null); return; }

          callback(null, result);
        });
      });
    }
    else {
      callback(error, document);
    }
  });
}



BaseMongo.prototype.count = function(query, callback) {
  this._coll().find(query).count(false, callback);
}



BaseMongo.prototype.remove = function(id, callback) {
  var query = this._find_one_query(id);
  this._coll().remove(query, callback);
}



BaseMongo.prototype.insert = function(document, callback) {
  var inserting = this.pass_through_validation(document, true);
  this._coll().insert(inserting, callback);
}



BaseMongo.prototype.update = function(id, update, callback) {
  var query = this._find_one_query(id);
  var updating = validate.update(update, this.definition);
  this._coll().update(query, 
                      updating, 
                      {upsert:false, multi:false, w: 1}, 
                      callback);
}



BaseMongo.prototype.upsert = function(id, document, callback) {
  var query = this._find_one_query(id);
  var inserting = this.pass_through_validation(document, true);
  this._coll().update(query, 
                      inserting, 
                      {upsert:true, multi:false, w: 1}, 
                      callback);
}



BaseMongo.prototype.pass_through_validation = function(vehicle, require_full) {
  if (require_full === undefined) {
    require_full = true;
  }
  return validate.datatype(vehicle, this.definition, require_full);
}



BaseMongo.prototype.reference = function(object, callback) {
  object.references = {};
  callback(null, object);
}



BaseMongo.prototype.reference_all = function(objects, callback) {
  var self = this;
  async.forEach(objects, 
    function(object, async_callback){
      self.reference(object, function(error, object){
        if (error) {
          async_callback(error);
          return;
        }
        async_callback();
      });
    }, 
    function(finished_error) {
      callback(finished_error, objects);
    });
}



BaseMongo.prototype.calculate = function(object, callback) {
  object.calculated = {};
  callback(null, object);
}



BaseMongo.prototype.calculate_all = function(objects, callback) {
  var self = this;
  async.forEach(objects, 
    function(object, async_callback){
      self.calculate(object, function(error, object){
        if (error) {
          async_callback(error);
          return;
        }
        async_callback();
      });
    }, 
    function(finished_error) {
      callback(finished_error, objects);
    });
}



BaseMongo.prototype.ensure_indexes = function() {
  
}



BaseMongo.prototype._coll = function() {
  if (this.collection == undefined) {
    this.collection = this.mongo.db_collection(
              this.config.database, 
              this.config.collection);
  }
  return this.collection;
}



BaseMongo.prototype._find_one_query = function(id) { 
  return {ID : id};
}



BaseMongo.prototype.toString = function() {
  return '[BaseMongo: '+this.config.database+'.'+this.config.collection+']';
}



module.exports = BaseMongo;
