var git = require("nodegit");
var ipc = require("electron").ipcMain;
var path = require("path");
var cli = require("staticsite-cli");

var app = require("../main");
var helpers = require("../helpers");

var WIN_NEW_SITE_ID = "addNewSite";
var WIN_EXISTING_SITE_ID = "addExistingSite";

ipc.on("app.addNewSite", addNewSiteWindow);
ipc.on("app.addExistingSite", addExistingSiteWindow);

ipc.on("app.createNewSite", createNewSite);
ipc.on("app.cloneExistingSite", cloneExistingSite);

ipc.on("app.previewSite", previewSite);
ipc.on("app.publishSite", publishSite);

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

function previewSite(event, siteDir) {
  app.trigger('app', 'status.set', `Loading site preview`);
  rebuildSite(siteDir, function(error) {
    if(error) {
      console.log(error);
    }
    cli.serve({}, function(error, data) {
      if(error) {
        console.log(error);
      }
      app.trigger('app', 'status.hide');
      var win = app.windows.preview;
      if(win) {
        return app.trigger('preview', 'preview.load', data.url);
      }
      win = app.addWindow({
        id: 'preview',
        filename: 'preview.html',
        width: app.screenSize.width*0.9,
        height: app.screenSize.height
      });
      win.once('ready-to-show', function() {
        app.trigger('preview', 'preview.load', data.url);
      });
    });
  });
}

function publishSite(event, siteDir) {
  console.log('publishing live site', siteDir);
  rebuildSite(siteDir, function(error) {
    if(error) console.log(error);
    // TODO upload to server
  });
}

function rebuildSite(siteDir, cb) {
  return cli.build({ dir: siteDir }, cb);
}
