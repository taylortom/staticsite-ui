var electron = require("electron");
var fs = require("fs-extra");
var git = require("nodegit");

var Constants = require("./constants");

var BrowserWindow = require("electron").BrowserWindow;
var ipc = require("electron").ipcMain;
var instance;

electron.app.on("ready", function onElectronReady() {
  getInstance();
  // load main controller
  require("./controllers/app");

  addWindow({
    id: "app",
    filename: "app.html",
    width: 850,
    height: 2000
  });

  // load sites
  // fs.readdir(path.join(this.root, 'sites'), function(error, dirs) {
  //   if(error) return;
  //   _.each(dirs, console.log);
  // });
});

function Main() {
  this.windows = {};
  this.Constants = Constants;

  this.addChildWindow = function(opts) {
    opts.parent = instance.windows.app;
    addWindow(opts);
  };
  this.removeChildWindow = function(id) {
    if(instance.windows[id] && instance.windows[id].parent === instance.windows.main) {
      removeWindow(id);
    }
  };
}

function addWindow(opts) {
  var id = opts.id;
  delete opts.id;
  var filename = opts.filename;
  delete opts.filename;

  var win = new BrowserWindow(opts);
  instance.windows[id] = win;
  win.loadURL(`file://${__dirname}/views/${filename}`);
}

function removeWindow(id) {
  if(instance.windows[id]) {
    instance.windows[id] = null;
  }
}

function slugify(str) {
  return str.replace(/\s|\//g, "-");
}

function getInstance() {
  if(!instance) instance = new Main()
  return instance;
}

module.exports = getInstance();
