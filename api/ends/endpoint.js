
var package_error = require("../helpers/error.js");
var input_parser = require("../helpers/parser.js");
var formatter = require("util").format;

module.exports = function(app, end_config, mongo, logger, all_config) {
  
  var curr = this;
  this.config = end_config;
  this.access = new (require("../dao/"+end_config.dao+".js"))(mongo, 
                                                              logger, 
                                                              all_config);
  
  
  
  
  
  this.init = function() {
    var report = "setting up endpoint with config: \n";
    report += (" - "+JSON.stringify(end_config)+"\n");
    
    
    
    var get_endpoint_proxy = function(req, res)
    {curr.endpoint_get_entry(req, res);};
    
    var get_endpoint_1 = formatter(this.endpoint_get_get_format, 
                                   this.config.url_root);
    report += (" - setup endpoint:  get "+get_endpoint_1+"\n");
    app.get(get_endpoint_1, get_endpoint_proxy);
    
    var get_endpoint_2 = formatter(this.endpoint_get_post_format, 
                                   this.config.url_root);
    report += (" - setup endpoint: post "+get_endpoint_2+"\n");
    app.post(get_endpoint_2, get_endpoint_proxy);
    
    
    
    var search_endpoint_proxy = function(req, res)
    {curr.endpoint_search_entry(req, res)};
    
    var search_endpoint_1 = formatter(this.endpoint_search_get_format, 
                                      this.config.url_root);
    report += (" - setup endpoint:  get "+search_endpoint_1+"\n");
    app.get(search_endpoint_1, search_endpoint_proxy);
    
    var search_endpoint_2 = formatter(this.endpoint_search_post_format, 
                                      this.config.url_root);
    report += (" - setup endpoint: post "+search_endpoint_2+"\n");
    app.post(search_endpoint_2, search_endpoint_proxy);
    
    
    
    var updatefield_endpoint_proxy = function(req, res)
    {curr.endpoint_update_field_entry(req, res)};
    
    var updatefield_endpoint_1 = formatter(this.endpoint_update_get_format, 
                                           this.config.url_root);
    report += (" - setup endpoint:  get "+updatefield_endpoint_1+"\n");
    app.get(updatefield_endpoint_1, updatefield_endpoint_proxy);
    
    var updatefield_endpoint_2 = formatter(this.endpoint_update_post_format, 
                                           this.config.url_root);
    report += (" - setup endpoint: post "+updatefield_endpoint_2+"\n");
    app.post(updatefield_endpoint_2, updatefield_endpoint_proxy);
    
    
    
    var insert_endpoint_proxy = function(req, res)
    {curr.endpoint_insert_entry(req, res)};
    
    var insert_endpoint_1 = formatter(this.endpoint_insert_get_format, 
                                      this.config.url_root);
    report += (" - setup endpoint:  get "+insert_endpoint_1+"\n");
    app.get(insert_endpoint_1, insert_endpoint_proxy);
    
    var insert_endpoint_2 = formatter(this.endpoint_insert_post_format, 
                                      this.config.url_root);
    report += (" - setup endpoint: post "+insert_endpoint_2+"\n");
    app.post(insert_endpoint_2, insert_endpoint_proxy);
    
    
    
    var delete_endpoint_proxy = function(req, res)
    {curr.endpoint_delete_entry(req, res)};
    
    var delete_endpoint_1 = formatter(this.endpoint_delete_get_format, 
                                      this.config.url_root);
    report += (" - setup endpoint:  get "+delete_endpoint_1+"\n");
    app.get(delete_endpoint_1, delete_endpoint_proxy);
    
    var delete_endpoint_2 = formatter(this.endpoint_delete_post_format, 
                                      this.config.url_root);
    report += (" - setup endpoint: post "+delete_endpoint_2+"\n");
    app.post(delete_endpoint_2, delete_endpoint_proxy);
    
    
    logger.info(report);
    
  }
  
  
  
  
  
  
  
  this.endpoint_get_get_format  = "/%s/get/:id/:projection?";
  this.endpoint_get_post_format = "/%s/get";
  this.endpoint_get_entry = function(req, res) {
    if (!mongo.is_mongo_ready(res)) return;
    
    var report
    var parsed_inputs;
    try {
      parsed_inputs = this.endpoint_get_input(req, res);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while parsing input",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
      return;
    }
    
    if (!parsed_inputs) return;
    
    try {
      this.endpoint_get_query(req, res, parsed_inputs);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while querying data",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
    }
  }
  this.endpoint_get_input = function(req, res) {
    var id = false;
    var projection = false;
    if (req.method == "POST") {
      id = input_parser.scalar(req.body.id);
      projection = input_parser.projection(req.body.projection);
    }
    else if (req.method == "GET") {
      id = input_parser.scalar(req.params.id);
      projection = input_parser.projection(req.params.projection);
    }
    else {
      res.send({
        ok : false,
        note : "only get and post methods can be used for this call",
        error : "an invalid method was used for http"
      });
      return false;
    }
    return {
      id : id,
      projection : projection
    }
  }
  this.endpoint_get_query = function(req, res, parsed_inputs) {
    
    var id = parsed_inputs.id;
    var projection = parsed_inputs.projection;

    var mongo_callback = function(err, item) {
      logger.debug("mongo callback: find_one");
      if (mongo.is_mongo_error(res, err, id)) return;

      if (item) {
        res.send({
          ok : true,
          query : id,
          projection : projection,
          note : "one item found",
          result : item
        });
      }
      else {
        res.send({
          ok : true,
          query : id,
          projection : projection,
          note : "no items found",
          result : null
        });
      }
    }
    
    curr.access.find_one(id, projection, mongo_callback);
  }
  
  
  
  
  
  
  
  this.endpoint_search_get_format  = "/%s/search";
  this.endpoint_search_post_format = "/%s/search";
  this.endpoint_search_entry = function(req, res) {
    if (!mongo.is_mongo_ready(res)) return;
    
    var report;
    var parsed_inputs;
    try {
      parsed_inputs = this.endpoint_search_input(req, res);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while parsing input",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
      return;
    }
    
    if (!parsed_inputs) return;
    
    try {
      this.endpoint_search_query(req, res, parsed_inputs);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while querying data",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
    }
  }
  this.endpoint_search_input = function(req, res) {
    var query = false;
    var sort = false;
    var count = false;
    var projection = false;
    var page_size = false;
    var page_number = false;
    if (req.method == "POST") {
      query = input_parser.query(req.body.query, this.access.definition);
      sort = input_parser.sort(req.body.sort);
      count = input_parser.bool(req.body.count);
      projection = input_parser.projection(req.body.projection);
      page_size = input_parser.number(req.body.pagesize);
      page_number = input_parser.number(req.body.pagenum);
    }
    else if (req.method == "GET") {
      query = input_parser.query(req.query.query, this.access.definition);
      sort = input_parser.sort(req.query.sort);
      count = input_parser.bool(req.query.count);
      projection = input_parser.projection(req.query.projection);
      page_size = input_parser.number(req.query.pagesize);
      page_number = input_parser.number(req.query.pagenum);
    }
    else {
      res.send({
        ok : false,
        note : "only get and post methods can be used for this call",
        error : "an invalid method was used for http"
      });
      return false;
    }
    if (!query) {
      res.send({
        ok : false,
        query : null,
        projection : null,
        note : "a 'query' field must be specified with valid json",
        error : "no 'query' specified"
      });
      return false;
    }
    return {
      query : query,
      sort : sort,
      count : count,
      projection : projection,
      page_size : page_size,
      page_number : page_number
    };
  }
  this.endpoint_search_query = function(req, res, parsed_inputs) {

    var query = parsed_inputs.query;
    var sort = parsed_inputs.sort;
    var count = parsed_inputs.count;
    var projection = parsed_inputs.projection;
    var page_size = parsed_inputs.page_size;
    var page_number = parsed_inputs.page_number;

    var options = {};
    if (page_size !== undefined && page_number !== undefined) {
      options.skip = (page_size * page_number);
      options.limit = (page_size);
    }
    
    var callback = function(err, items) {
      if (mongo.is_mongo_error(res, err, query)) return;

      if (items) {
        if (count) {
          curr.access.count(query, function(error, count) {
            if (mongo.is_mongo_error(res, error, query)) return;

            res.send({
              ok : true,
              query : query,
              projection : projection,
              sort : sort,
              count : count,
              note : "found "+count+" documents",
              result : items
            });
          });
        }
        else {
          res.send({
            ok : true,
            query : query,
            projection : projection,
            sort : sort,
            note : "found documents",
            result : items
          });
        }
      }
      else {
        res.send({
          ok : true,
          query : query,
          projection : projection,
          sort : sort,
          count : 0,
          note : "found 0 documents",
          result : null
        });
      }
    }
    
    curr.access.find({
      query : query,
      projection : projection,
      sort : sort,
      options : options
    }, callback);
  }
  
  
  
  
  
  
  
  this.endpoint_update_get_format  = "/%s/update/:id/:op1/:op2?";
  this.endpoint_update_post_format = "/%s/update";
  this.endpoint_update_field_entry = function(req, res) {
    if (!mongo.is_mongo_ready(res)) return;
    
    var report;
    var parsed_inputs;
    try {
        parsed_inputs = this.endpoint_update_field_input(req, res);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while parsing input",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
      return;
    }
    
    if (!parsed_inputs) return;
    
    try {
      this.endpoint_update_field_query(req, res, parsed_inputs);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while querying data",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
    }
  }
  this.endpoint_update_field_input = function(req, res) {
    
    var id = false;
    var update = false;
    
    if (req.method == "POST") {
      id = input_parser.scalar(req.body.id);
      if (req.body.update) {
        update = input_parser.update(req.body.update);
      }
      else if (req.body.field && req.body.value) {
        update = {};
        update['$set'] = {};
        update['$set'][req.body.field] = input_parser.scalar(req.body.value);
      }
    }
    else if (req.method == "GET") {
      id = input_parser.scalar(req.params.id);
      if (req.params.op1 && req.params.op2) {
        update = {};
        update['$set'] = {};
        update['$set'][req.params.op1] = input_parser.scalar(req.params.op2);
      }
      else if (req.params.op1) {
        update = input_parser.update(req.params.op1);
      }
    }
    else {
      res.send({
        ok : false,
        note : "only get and post methods can be used for this call",
        error : "an invalid method was used for http"
      });
      return false;
    }
    
    if (!id || !update) {
      res.send({
        ok : false,
        note : "the fields required for this endpoint"+
          " are 'id', 'field', and 'value'",
        error : "not all of the required fields have be sent"
      });
      return false;
    }
    
    return {
      id : id,
      update : update
    }
  }
  this.endpoint_update_field_query = function(req, res, parsed_inputs) {
    
    var id = parsed_inputs.id;
    var update = parsed_inputs.update;
    
    var callback = function(err, num_updated) {
      if (mongo.is_mongo_error(res, err, id)) return;
      
      if (num_updated) {
        res.send({
          ok : true,
          query : id,
          update : update,
          note : "set value"
        });
      }
      else {
        res.send({
          ok : true,
          query : id,
          update : update,
          note : "could not find document to set value"
        });
      }
    }
    
    curr.access.update(id, update, callback);
  }
  
  
  
  
  
  
  
  this.endpoint_insert_get_format  = "/%s/insert/:document";
  this.endpoint_insert_post_format = "/%s/insert";
  this.endpoint_insert_entry = function(req, res) {
    if (!mongo.is_mongo_ready(res)) return;
    
    var report;
    var parsed_inputs;
    try {
        parsed_inputs = this.endpoint_insert_input(req, res);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while parsing input",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
      return;
    }
    
    if (!parsed_inputs) return;
    
    try {
      this.endpoint_insert_query(req, res, parsed_inputs);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while inserting data",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
    }
  }
  this.endpoint_insert_input = function(req, res) {
    
    var document = false;
    
    if (req.method == "POST") {
      document = JSON.parse(req.body.document);
    }
    else if (req.method == "GET") {
      document = JSON.parse(req.params.document);
    }
    else {
      res.send({
        ok : false,
        note : "only get and post methods can be used for this call",
        error : "an invalid method was used for http"
      });
      return false;
    }
    
    if (!document) {
      res.send({
        ok : false,
        note : "the fields required for this endpoint"+
          " are 'document'",
        error : "not all of the required fields have be sent"
      });
      return false;
    }
    
    return {
      document : document
    }
  }
  this.endpoint_insert_query = function(req, res, parsed_inputs) {
    
    var document = parsed_inputs.document;
    
    var callback = function(err, result) {
      if (mongo.is_mongo_error(res, err, "insert")) return;
      
      res.send({
        ok : true,
        note : "document inserted",
        insert : document,
        result : result
      });
    }
    
    curr.access.insert(document, callback);
  }
  
  
  
  
  
  
  
  this.endpoint_delete_get_format  = "/%s/delete/:id";
  this.endpoint_delete_post_format = "/%s/delete";
  this.endpoint_delete_entry = function(req, res) {
    if (!mongo.is_mongo_ready(res)) return;
    
    var report
    var parsed_inputs;
    try {
      parsed_inputs = this.endpoint_delete_input(req, res);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while parsing input",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
      return;
    }
    
    if (!parsed_inputs) return;
    
    try {
      this.endpoint_delete_query(req, res, parsed_inputs);
    }
    catch(ex) {
      report = {
        ok : false,
        note : "error while deleting data",
        error : package_error(ex)
      };
      logger.error(report);
      res.send(report);
    }
  }
  this.endpoint_delete_input = function(req, res) {
    var id = false;
    if (req.method == "POST") {
      id = input_parser.scalar(req.body.id);
    }
    else if (req.method == "GET") {
      id = input_parser.scalar(req.params.id);
    }
    else {
      res.send({
        ok : false,
        note : "only get and post methods can be used for this call",
        error : "an invalid method was used for http"
      });
      return false;
    }
    return {
      id : id
    }
  }
  this.endpoint_delete_query = function(req, res, parsed_inputs) {
    
    var id = parsed_inputs.id;

    var mongo_callback = function(err, deleted_count) {
      if (mongo.is_mongo_error(res, err, id)) return;

      res.send({
        ok : true,
        query : id,
        note : "item deleted"
      });
    }

    curr.access.remove(id, mongo_callback);
  }
  
}



