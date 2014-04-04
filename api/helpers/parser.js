
var logger = require("./logging.js")();

module.exports.allowed_query_opps = [
  '$gt',
  '$lt',
  '$gte',
  '$lte',
  '$or',
  '$nor',
  '$and',
  '$not',
  '$regex',
  '$options',
  '$in',
  '$nin',
];

module.exports.allowed_update_opps = [
  '$set',
  '$inc',
  '$pull',
  '$push',
  '$slice',
  '$sort',
];

module.exports.query = function(raw_query, def) {
  var object;
  if (typeof(raw_query) == "object") {
    object = raw_query;
  }
  else if (typeof(raw_query) == "string") {
    object = JSON.parse(raw_query);
  }
  else {
    throw new Error("unable to parse query: "+JSON.stringify(raw_query));
  }
  return module.exports.parse_recurse(
                    object, module.exports.allowed_query_opps, def);
}

module.exports.update = function(raw_update) {
  var object;
  if (typeof(raw_query) == "object") {
    object = raw_update;
  }
  else if (typeof(raw_query) == "string") {
    object = JSON.parse(raw_update);
  }
  else {
    throw new Error("unable to parse update: "+JSON.stringify(raw_update));
  }
  return module.exports.parse_recurse(object, module.exports.allowed_update_opps);
}

module.exports.parse_recurse = function(root, allowed_opps, def) {
  logger.debug(root);
  if (typeof(root) == "object") {
    for(var i in root) {
      if (typeof(i) == "string" && i[0] == '$' && 
          allowed_opps.indexOf(i) <= -1) {
        throw new Error("invalid query: opp "+i+" is not recognized");
      }
      var next_def = null;
      if (def) {
        next_def = (function(){
          var split = i.split(".");
          var pointer = def;
          for(var it in split) {
            pointer = (pointer.object_def ? pointer.object_def[ split[it] ] : 
                                            pointer[ split[it] ]);
            logger.debug("pointer: "+split[it]);
            logger.debug(pointer);
          }
//          logger.debug("pointer final: ");
          logger.debug(pointer);
          return pointer;
        })();
      }
      root[i] = module.exports.parse_recurse(root[i], allowed_opps, next_def);
    }
  }
  else {
    if (def) {
      switch(def.datatype) {
        case "bool": return module.exports.bool(root);
        case "number": return module.exports.number(root);
        case "string": return module.exports.string(root);
        case "date": return module.exports.date(root);
        default: return module.exports.scalar(root);
      }
    }
    else {
      return module.exports.scalar(root);
    }
  }
  return root;
}







module.exports.sort = function(raw_sort) {
  return module.exports.flags(raw_sort);
}

module.exports.projection = function(raw_projection) {
  return module.exports.flags(raw_projection);
}

module.exports.flags = function(flags) {
  if (logger.isDebugEnabled()) {
    logger.debug("parsing flags: "+JSON.stringify(flags));
    logger.debug(flags);
  }
  if (!flags) {
    return false;
  }
  
  var object;
  if (typeof(flags) == "string") {
    // if the raw object is a string, then we will either:
    // 1 - parse as a json object
    // 2 - split the fields to be delimited by "-"
    if (flags[0] == "[" || flags[0] == "{") {
      logger.debug("flags as parsing string");
      object = JSON.parse(flags);
    }
    else {
      logger.debug("flags as split string");
      object = flags.split("-");
    }
  }
  else {
    logger.debug("flags as raw object");
    object = flags;
  }
  
  var result = false;
  if (object instanceof Array) {
    result = {};
    for(var i = 0; i < object.length; i++) {
      result[object[i]] = 1;
    }
  }
  else if (typeof(object) == "object") {
    result = object;
  }
  else {
    logger.warn("unable to parse flags: "+JSON.stringify(flags));
  }
  return result;
}







module.exports.scalar = function(scalar) {
  if (scalar === undefined) {
    return undefined;
  }
  if (scalar === null || scalar === "null") {
    return null;
  }
  var check;
  
  check = module.exports.bool(scalar);
  if (check != undefined) {
    logger.debug("parsed as bool: ");
    logger.debug(check);
    return check;
  }
  
  check = module.exports.number(scalar);
  if (check != undefined) {
    logger.debug("parsed as number: ");
    logger.debug(check);
    return check;
  }
  
  check = module.exports.date(scalar);
  if (check != undefined) {
    logger.debug("parsed as date: ");
    logger.debug(check);
    return check;
  }
  
  logger.debug("parsed as string: ");
  logger.debug(scalar);
  return scalar;
}

module.exports.string = function(string) {
  if (string == null || string == undefined) {
    return undefined;
  }
  return string.toString();
}

module.exports.number = function(number) {
  if (typeof(number) == "number") {
    return number;
  }
  if (typeof(number) == "string" && number.match(/^-?[\d\.]*$/)) {
    return parseFloat(number);
  }
  return undefined;
}

module.exports.bool = function(bool) {
  if (typeof(bool) == "string") {
    if (bool == "true") {
      return true;
    }
    if (bool == "false") {
      return false;
    }
  }
  else if (typeof(bool) == "boolean") {
    return bool;
  }
  return undefined;
}

module.exports.date = function(date) {
  if (date instanceof Date) {
    return date;
  }
  var check = undefined;
  if (typeof(date) == "number") {
    check = new Date(date);
  }
  if (typeof(date) == "string") {
    check = new Date(date);
  }
  
  if (check == null || check.toString() == "Invalid Date") {
    return undefined;
  }
  return check;
}

module.exports.duration = function(duration) {
  if (typeof(duration) == "number") {
    return duration;
  }
  if (typeof(duration) == "string") {
    var duration_split = duration.split(":");
    var base_hours = parseInt(duration_split[0]);
    var base_minutes = parseInt(duration_split[1]);
    var base_seconds = parseInt(duration_split[2]);
    return (base_hours * 60 * 60 + base_minutes * 60 + base_seconds);
  }
  
  return 0;
}
