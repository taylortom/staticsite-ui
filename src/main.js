var electron = require("electron");
var fs = require("fs-extra");

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
  // create window
  var win = new BrowserWindow(Object.assign({
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#282c34'
  }, opts));
  instance.windows[id] = win;
  win.loadURL(`file://${__dirname}/views/${filename}`);
}

function removeWindow(id) {
  if(instance.windows[id]) {
    instance.windows[id].close();
    instance.windows[id] = null;
  }
}

function getInstance() {
  if(!instance) instance = new Main()
  return instance;
}

module.exports = getInstance();
