
module.exports = function(error) {
  var stack = (error.stack ? error.stack.split("\n") : '');
  return {
    name : error.name,
    message : error.message,
    stack : stack
  }
}
