var path = require('path');
var jsondata = require('./jsondata');

module.exports = function(sitename) {
  return new jsondata(path.join(__dirname, '..', 'sites', sitename, '_data', 'config.json'));
};
