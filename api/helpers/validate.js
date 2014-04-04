
var parser = require("./parser.js");
var logger = require("./logging.js")();


module.exports.datatype = function(object, object_def, require_full) {
  return module.exports.datatype_recurse(
                    object, object_def, require_full, "root");
}

module.exports.datatype_recurse = function(
        object, object_def, require_full, path) {
  
  if (logger.isDebugEnabled()) {
    logger.debug("module.exports.datatype_recurse()");
    logger.debug(object);
    logger.debug(object_def);
  }
  
  var datatype = "object";
  if (object_def.datatype) {
    datatype = object_def.datatype;
  }
  
  if (object === null || object === undefined) {
    if (!object_def.datatype) {
      throw new Error("no data to validate");
    }
    if (object_def.validate && !object_def.validate(object)) {
      throw new Error(path+" is null when its required");
    }
    return null;
  }
  
  switch(datatype) {
    case "bool":
      var parsed_bool = parser.bool(object);
      if (!object_def.validate(parsed_bool)) 
        throw new Error(path+" is an invalid bool: "+parsed_bool);
      return parsed_bool;
      
    case "number":
      var parsed_number = parser.number(object);
      if (!object_def.validate(parsed_number)) 
        throw new Error(path+" is an invalid number: "+parsed_number);
      return parsed_number;
      
    case "string":
      var parsed_string = parser.string(object);
      if (!object_def.validate(parsed_string)) 
        throw new Error(path+" is an invalid string: "+parsed_string);
      return parsed_string;
      
    case "date":
      var parsed_date = parser.date(object);
      if (!object_def.validate(parsed_date)) 
        throw new Error(path+" is an invalid date: "+parsed_date);
      return parsed_date;
      
    case "object":
      var object_result = {};
      var iterating = object;
      if (require_full) {
        iterating = {};
        for(var obj_name in object) {
          iterating[obj_name] = 1;
        }
        for(var def_name in object_def) {
          iterating[def_name] = 1;
        }
      }
      for(var name in iterating) {
        var obj_def = (object_def.object_def) ? 
          object_def.object_def[name] : 
          object_def[name];
        if (!obj_def) {
          throw new Error("unknown key: "+name);
        }
        
        object_result[name] = module.exports.datatype_recurse(
                          object[name], obj_def, require_full, path+"."+name);
      }
      return object_result;
      
    case "array":
      var array_result = [];
      for(var i in object) {
        var array_element = module.exports.datatype_recurse(
                    object[i], object_def.object_def, require_full, path+"."+i);
        array_result.push(array_element);
      }
      return array_result;
      
    case "any":
      return object;
      
    default:
      throw new Error("unknown datatype: "+definition.datatype);
  }
}

module.exports.update = function(object, object_def) {
  
  if (logger.isDebugEnabled()) {
    logger.debug("module.exports.update()");
    logger.debug(object);
    logger.debug(object_def);
  }
  
  var object_keys = Object.keys(object);
  if (object_keys.length == 0) {
    throw new Error("nothing to update");
  }
  
  if (object_keys.length > 1) {
    return module.exports.datatype(object, object_def, true);
  }
  
  var keyname = object_keys[0];
  if (parser.allowed_update_opps.indexOf(keyname) < 0) {
    throw new Error(keyname+" not allowed for update or is not recognized");
  }
  
  var loose_object = object[keyname];
  logger.debug(loose_object);
  for(var name in loose_object) {
    var definition = (function(){
      logger.debug(name);
      var name_split = name.split(".");
      var pointer = object_def;
      for(var i in name_split) {
        if (pointer[name_split[i]]) {
          pointer = pointer[name_split[i]];
        }
        else {
          logger.debug("pointer result: null");
          return null;
        }
      }
      if (logger.isDebugEnabled()) {
        logger.debug("pointer result: ");
        logger.debug(pointer);
      }
      return pointer;
    })();
    if (!definition) {
      throw new Error("definition not found for key: "+name);
    }
    
    if (definition.normalize) {
      loose_object[name] = definition.normalize(loose_object[name]);
    }
    
    var parsed_value;
    logger.debug(definition.datatype);
    switch(definition.datatype) {
      case "bool":
        parsed_value = parser.bool(loose_object[name]);
        break;

      case "number":
        parsed_value = parser.number(loose_object[name]);
        break;

      case "string":
        parsed_value = parser.string(loose_object[name]);
        break;
      
      case "date":
        parsed_value = parser.date(loose_object[name]);
        break;

      default:
        throw new Error("unallowed or unrecognized datatype: "+definition.datatype);
    }
    
    if (!definition.validate(parsed_value)) 
      throw new Error("invalid value: "+parsed_value);
    
    loose_object[name] = parsed_value;
  }
  
  return object;
}







module.exports.always = function() {
  return true;
}

module.exports.not_null = function(data) {
  return (data !== null && data !== undefined);
}

module.exports.channel = function(channel) {
  return  (channel == "TV") ||
          (channel == "Film") ||
          (channel == "Digital") ||
          (channel == "Music") ||
          (channel == "Celebrity");
}

module.exports.power = function(power) {
  return  (power == "A") ||
          (power == "B") ||
          (power == "C");
}

module.exports.quality = function(quality) {
  return  (quality == "Premium") ||
          (quality == "Prominent") ||
          (quality == "Standard");
}
