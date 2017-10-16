var path = require('path');
var jsondata = require('./jsondata');

var data;

module.exports = function() {
  if(!data) {
    data = new jsondata(path.join(__dirname, '..', '.appdata'));
  }
  return data;
};
