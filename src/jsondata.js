var fs = require('fs-extra');

module.exports = class JSONData {
  constructor(path) {
    var _DATA_PATH = path;
    var _data = {};

    try {
      _data = fs.readJsonSync(_DATA_PATH);
    } catch(e) {
      if(e.code !== 'ENOENT') console.error(e);
    }
    /**
    * Public API
    */
    return {
      get: function(key) {
        return _data[key];
      },
      set: function(key, value) {
        // TODO allow objects
        // appdata.set({
        //   authToken: tokenData.access_token
        //   authUser: userData
        // });
        _data[key] = value;
        saveData();
      }
    };
  }
  _saveData() {
    try {
      fs.writeJsonSync(_DATA_PATH, data);
    } catch(e) {
      console.log(e);
    }
  }
};
