var fs = require('fs');
var path = require('path');

module.exports = function Atomisr(filepath, data) {
  data = data || {};
  var fileContents = fs.readFileSync(path.join(__dirname, 'views', 'atoms', filepath)).toString();
  var templateStrings = fileContents.match(RegExp(`{{.+?}}`, 'g')) || [];
  templateStrings.forEach(function(templateString) {
    var keys = templateString.slice(2,-2).split('.');
    var value = data;
    // build up the nested value
    keys.forEach(function(key) { value = value[key]; });
    fileContents = fileContents.replace(RegExp(`${templateString}`, 'g'), value);
  });
  // TODO: automatically wrap everything in script tags to avoid global scope pollution
  // fileContents = fileContents.replace(RegExp('<script type="text\/javascript">([\s\S]*?)<\/script>', 'g'), function() {
  //   console.log('dfsfs', arguments.slice());
  // });
  // remove anything not found in data
  return fileContents.replace(/{{.+?}}/g, '');
}
