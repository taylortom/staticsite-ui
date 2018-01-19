var path = require('path');
var jsondata = require('./jsondata');

module.exports = function(sitename) {
  sitename = path.join(sitename, '_data', 'config.json');
  var prefix = path.join(__dirname, '..',  '..', 'sites');
  if(sitename.indexOf(prefix) === -1) {
    sitename = path.join(prefix, sitename);
  }
  return new jsondata(sitename);
};
