var fs = require('fs');
var path = require('path');

module.exports = function Atomisr(filepath, data) {
  data = data || {};
  var fileContents = fs.readFileSync(path.join(__dirname, 'views', 'atoms', filepath)).toString();
  for(var i = 0, count = Object.keys(data).length; i < count; i++) {
    var key = Object.keys(data)[i];
    var value = data[key];
    fileContents = fileContents.replace(RegExp(`{{${key}}}`, 'g'), value);
  }
  // wrap everything in script tags to avoid global scope pollution
  // fileContents = fileContents.replace(RegExp('<script type="text\/javascript">([\s\S]*?)<\/script>', 'g'), function() {
  //   console.log('dfsfs', arguments.slice());
  // });
  // remove anything not found in data
  return fileContents.replace(/{{.+?}}/g, '');
}
