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

  instance.screenSize = getScreenSize();

  addWindow({
    id: "app",
    filename: "app.html",
    width: width*0.75,
    height: height
  });
});

function Main() {
  this.windows = {};
  this.Constants = Constants;

  this.addWindow = addWindow;
  this.removeWindow = removeWindow;
  this.addChildWindow = function(opts) {
    opts.parent = instance.windows.app;
    addWindow(opts);
  };
  this.removeChildWindow = function(id) {
    if(instance.windows[id] && instance.windows[id].parent === instance.windows.main) {
      removeWindow(id);
    }
  };
  this.trigger = function(windowId, eventName, data) {
    var win = this.windows[windowId];
    if(!win) {
      return console.log(`Cannot trigger event, unknown window '${windowId}'`);
    }
    win.webContents.send(eventName, data);
  }
}

function addWindow(opts) {
  if(opts.filename && opts.url) {
    return console.log(`Cannot add window, filename (${opts.filename}) and url (${opts.url}) specified`);
  }
  var id = opts.id;
  delete opts.id;
  var filename = opts.filename;
  delete opts.filename;
  var url = opts.url;
  delete opts.url;
  // create window
  var win = new BrowserWindow(Object.assign({
    backgroundColor: '#282c34'
  }, opts));
  instance.windows[id] = win;
  win.loadURL(url || `file://${__dirname}/views/${filename}`);

  return win;
}

function removeWindow(id) {
  if(instance.windows[id]) {
    instance.windows[id].close();
    instance.windows[id] = null;
  }
}

function getScreenSize() {
  return {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
}

function getInstance() {
  if(!instance) instance = new Main()
  return instance;
}

module.exports = getInstance();
