var fs = require("fs");
var git = require("nodegit");
var ipc = require("electron").ipcMain;
var path = require("path");

var app = require("../main");
var cli = require("../utils/clidist");
var helpers = require("../utils/helpers");
var sitedata = require("../data/sitedata");

var WIN_NEW_SITE_ID = "addNewSite";
var WIN_EXISTING_SITE_ID = "addExistingSite";

ipc.on("app.addNewSite", addNewSiteWindow);
ipc.on("app.createNewSite", createNewSite);

ipc.on("app.addExistingSite", addExistingSiteWindow);
ipc.on("app.cloneExistingSite", cloneExistingSite);

ipc.on("app.addPage", addPage);

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
    alwaysOnTop: true
  });
}

function createNewSite(event, data) {
  app.removeChildWindow(WIN_NEW_SITE_ID);
  var slug = helpers.slugify(data.name);
  var dirname = path.join(app.Constants.Root, "sites", slug);
  git.Clone(app.Constants.BlankSiteRepo, dirname)
    .then(function(repo) {
      var sd = sitedata(dirname);
      console.log(sd);
      // TODO:set config,
      // TODO send event
    })
    .catch(function(err) {
      // TODO send error to UI
      console.log(err);
    });
}

function cloneExistingSite(event, url) {
  app.removeChildWindow(WIN_EXISTING_SITE_ID);
  if(!url) {
    url = 'https://github.com/taylortom/staticsite-skele.git';
  }
  var dirname = path.basename(url).replace('.git', '');
  git.Clone(url, path.join(app.Constants.Root, "sites", dirname))
    .then(function(repo) {
      var sd = sitedata(dirname);
      console.log(sd.get('name'));
      // app.windows.app.webContents.send("app.siteAdded", {
      //   name: data.name,
      //   dirname: dirname
      // });
    })
    .catch(function(err) {
      // TODO send error to UI
      console.log(err);
    });
}

function addPage(event, data) {
  if(!data.title || !data.title.text ) {
    return console.error('app.addPage: missing page title data');
  }
  var slug = helpers.slugify(data.title.text);
  // infer site name from data.site
  var sd = new sitedata(data.site.split(path.sep).pop());

  var pages = sd.get('pages');
  if(pages[slug]) {
    return console.log(`Cannot create ${slug}, it already exists`);
  }
  // add data to config.json
  pages[slug] = {
    title: {
      text: data.title.text,
      show: data.title.show || true
    },
    subDir: data.subDir || true
  };
  sd.set('pages', pages);
  // create .md
  fs.writeFileSync(path.join(data.site, '_pages', slug + '.md'), "");
}

function previewSite(event, siteDir) {
  app.trigger('app', 'status.set', `Loading site preview`);
  rebuildSite(siteDir, function(error) {
    if(error) {
      console.log(error);
    }
    cli.serve({ dir: siteDir }, function(error, data) {
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
