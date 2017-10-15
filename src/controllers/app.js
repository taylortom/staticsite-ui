var git = require("nodegit");
var ipc = require("electron").ipcMain;
var path = require("path");

var app = require("../main");
var helpers = require("../helpers");

var WIN_NEW_SITE_ID = "addNewSite";
var WIN_EXISTING_SITE_ID = "addExistingSite";

ipc.on("app.addNewSite", addNewSiteWindow);
ipc.on("app.addExistingSite", addExistingSiteWindow);
ipc.on("app.createNewSite", createNewSite);
ipc.on("app.cloneExistingSite", cloneExistingSite);

function addNewSiteWindow() {
  app.addChildWindow({
    id: WIN_NEW_SITE_ID,
    filename: "addNewSite.html",
    width: 450,
    height: 220,
    frame: false,
    alwaysOnTop: true
  });
}

function addExistingSiteWindow() {
  app.addChildWindow({
    id: WIN_EXISTING_SITE_ID,
    filename: "addExistingSite.html",
    width: 450,
    height: 600,
    frame: false,
    alwaysOnTop: true
  });
}

function createNewSite(event, data) {
  app.removeChildWindow(WIN_NEW_SITE_ID);
  console.log('createNewSite:', data);
}

function cloneExistingSite(event, url) {
  app.removeChildWindow(WIN_EXISTING_SITE_ID);
  if(!url) {
    url = 'https://github.com/taylortom/staticsite-skele.git';
  }
  var dirname = path.basename(url).replace('.git', '');
  console.log('cloneExistingSite:', url, dirname);
  //
  //
  return;
  //
  //
  git.Clone(url, path.join(app.Constants.Root, "sites", dirname))
    .then(function(repo) {
      app.windows.app.webContents.send("app.siteAdded", {
        name: data.name,
        dirname: dirname
      });
    })
    .catch(function(err) {
      console.log(err);
    });
}
