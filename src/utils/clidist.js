var requireTaskPool = require('electron-remote').requireTaskPool;

var cli = require("staticsite-cli");
var cliPool = requireTaskPool("staticsite-cli");

// provides wrapper to allow background processing for intensive tasks
module.exports = {
  build: function(args, cb) {
    cliPool.build(args)
      .then(function(data) { cb(null, data); })
      .catch(cb);
  },
  serve: cli.serve
};
