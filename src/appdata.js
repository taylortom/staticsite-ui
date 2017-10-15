var fs = require('fs-extra');
var path = require('path');

var DATA_PATH = path.join(__dirname, '.appdata');

var data = {};

(function loadData() {
  try {
    data = fs.readJsonSync(DATA_PATH);
  } catch(e) {
    if(e.code !== 'ENOENT') console.error(e);
  }
})();

function saveData() {
  try {
    fs.writeJsonSync(DATA_PATH, data);
  } catch(e) {
    console.log(e);
  }
}

module.exports = {
  get: function(key) {
    return data[key];
  },
  set: function(key, value) {
    // TODO allow objects
    // appdata.set({
    //   authToken: tokenData.access_token
    //   authUser: userData
    // });
    data[key] = value;
    saveData();
  }
};
