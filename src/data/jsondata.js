var _ = require('underscore');
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

    function _setData(key, value) {
      if(_.isString(key)) {
        _data[key] = value;
        return;
      }
      if(_.isObject(key)) {
        _.extend(_data, key);
      }
    }

    function _saveData() {
      try {
        fs.writeJsonSync(_DATA_PATH, _data, { spaces: 2 });
      } catch(e) {
        console.log(e);
      }
    }
    /**
    * Public API
    */
    return {
      get DATA_PATH() {
        return _DATA_PATH;
      },
      get(key) {
        return _data[key];
      },
      set(key, value) {
        _setData(key, value);
        _saveData();
      }
    };
  }
};
