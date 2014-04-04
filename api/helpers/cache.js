
var curr_time = function() {
  var date = new Date();
  var result = date.getTime();
  delete date;
  return result;
}



function ObjectCache() {
  this.cache = {};
}



ObjectCache.prototype.init = function(config, logger) {
  this.default_timeout = config.default_timeout;
  this.active = config.active;
  this.logger = logger;
}



ObjectCache.prototype.put = function(key, object, timeout) {
  if (!this.active) return;
  if (!timeout) {
    timeout = this.default_timeout;
  }
  var expires_at = (curr_time() + timeout);
  this.cache[key] = {obj : object, timeout : expires_at}
  this.logger.debug("cache: put "+key);
}



ObjectCache.prototype.get = function(key) {
  if (!this.active) return false;
  var result = this.cache[key];
  if (!result) {
    this.logger.debug("cache: miss "+key);
    return false;
  }
  
  var time = curr_time();
  if (result.timeout > time) {
    this.logger.debug("cache: hit "+key);
    return result;
  }
  
  this.logger.debug("cache: timeout "+key);
  delete this.cache[key];
  return false;
}



ObjectCache.prototype.get_all = function(keys, all) {
  var result = {};
  for(var i in keys) {
    var key = keys[i];
    result[key] = this.get(key);
    if (all && !result[key]) {
      return false;
    }
  }
  return result;
}



ObjectCache.prototype.invalidate = function(key) {
  if (this.cache[key]) {
    this.logger.debug("cache: invalidate "+key);
    delete this.cache[key];
  }
}



var instance = new ObjectCache();


module.exports = instance;
