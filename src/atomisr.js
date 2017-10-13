var fs = require('fs');

module.exports = function Atomisr(filepath, data) {
  var fileContents = fs.readFileSync(path.join(__dirname, 'views', 'atoms', filepath)).toString();
  for(var i = 0, count = Object.keys(data).length; i < count; i++) {
    var key = Object.keys(data)[i];
    var value = data[key];
    fileContents = fileContents.replace(RegExp(`{{${key}}}`, 'g'), value);
  }
  // remove anything not found in data
  return fileContents.replace(/{{.+?}}/g, '');
}
