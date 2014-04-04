
var mongo = require("../helpers/mongo.js");
var cache = require("../helpers/cache.js");


module.exports = function(mongo, logger, config) {
  
  var curr = this;
  this.collection = undefined;
  this._config = config.access.attribute;
  this.coll = function() {
    if (curr.collection == undefined) {
      curr.collection = mongo.db_collection(
                this._config.database, 
                this._config.collection);
    }
    return curr.collection;
  }
  
  
  
  
  
  this._config_id = function(config) { return "dictionary-"+config; }
  
  this._config_get_id = function(raw_config) { return raw_config.substr(11); }
  
  this.get_config = function(config, callback) {
    
    if (typeof(config) == "string") {
      // get single configuration
      var cache_try = cache.get(config);
      if (cache_try) {
        callback(null, cache_try);
      }
      else {
        curr.coll().findOne(
          {_id : curr._config_id(config)}, 
          function(error, document) {
            if (error) { callback(error, null); return; }

            if (document) {
              cache.put(config, document.data);
              callback(null, document.data);
            }
            else {
              callback(null, null);
            }
          });
      }
    }
    else {
      // get multiple configurations
      var cache_checks = cache.get_all(config, true);
      if (cache_checks) {
        callback(null, cache_checks);
      }
      else {
        var query = {'$or':[]};
        config.forEach(function(el) {
          query.$or.push( {_id : curr._config_id(el)} );
        });
        curr.coll().find(query).toArray(function(error, documents) {
          if (error) { callback(error, null); return; }

          if (documents) {
            var result = {};
            documents.forEach(function(document) {
              var config_name = curr._config_get_id(document._id);
              result[config_name] = document.data;
              cache.put(config_name, document.data);
            });
            callback(null, result);
          }
          else {
            callback(null, null);
          }
        });
      }
    }
  }
  
  this.set_config = function(config, data, callback) {
    var query = curr._config_id(config);
    var document = curr._config_id(config);
    document.data = data;
    curr.upsert(query, document, callback);
    
    cache.invalidate(config);
  }
  
  
  
  
  
  this._list_id = function(list) { return "list-"+list; }
  
  this._list_get_id = function(raw_list) { return raw_list.substr(5); }
  
  this.get_list = function(list, callback) {
    
    if (typeof(list) == "string") {
      // get single list
      curr.coll().findOne(
        {_id : curr._list_id(list)}, 
        function(error, document) {
          if (error) { callback(error, null); return; }
          
          if (document) {
            callback(null, document.data);
          }
          else {
            callback(null, null);
          }
        });
    }
    else {
      // get multiple list
      var query = {'$or':[]};
      list.forEach(function(el) {
        query.$or.push( {_id : curr._list_id(el)} );
      });
      curr.coll().find(query).toArray(function(error, documents) {
        if (error) { callback(error, null); return; }
          
        if (documents) {
          var result = {};
          documents.forEach(function(document) {
            var list_name = curr._list_get_id(document._id);
            result[list_name] = document.data;
          });
          callback(null, result);
        }
        else {
          callback(null, null);
        }
      });
    }
  }
  
  this.set_list = function(list, data, callback) {
    var query = curr._list_id(list);
    var document = curr._list_id(list);
    document.data = data;
    curr.upsert(query, document, callback);
  }
  
  
  
  
  this._increment_id = function(type) { return "increment-"+type; }
  
  this.increment = function(type, callback) {
    curr.coll().findAndModify(
        {_id : curr._increment_id(type)}, 
        [], 
        { // document update
          _id : curr._increment_id(type),
          $inc : { increment : 1 },
          $setOnInsert : { increment : 10000 }
        }, 
        { // options
          upsert : true,
          "new" : true,
          w : 1
        }, 
        function(error, document) {
          if (error) {
            callback(error, null);
            return;
          }
          
          var new_id = (type+document.increment);
          callback(error, new_id);
        });
  }
  
  
  
  
  
  this.upsert = function(query, document, callback) {
    curr.coll().update(query, 
                       document, 
                       {upsert:true, multi:false, w:1}, 
                       callback);
  }
  
}