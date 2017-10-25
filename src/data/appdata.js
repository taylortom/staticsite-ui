var path = require('path');

var Constants = require('./constants');
var jsondata = require('./jsondata');

var data;

module.exports = function() {
  if(!data) {
    data = new jsondata(path.join(Constants.Root, '.appdata'));
  }
  return data;
};
