var ipc = require("electron").ipcMain;
var app = require("../main");

var WIN_ID = "addSite";

ipc.on("app.addSite", addSite);
ipc.on("app.saveSite", saveSite);

function addSite() {
  app.addChildWindow({
    id: WIN_ID,
    filename: "addSite.html",
    width: 300,
    height: 200,
    frame: false,
    alwaysOnTop: true
  });
}

function saveSite(event, data) {
  var dirname = slugify(data.name);
  console.log(data, dirname);
  git.Clone(data.url, path.join(instance.root, "sites", dirname))
    .then(function(repo) {
      console.log(repo);
      app.windows.main.webContents.send("app.siteAdded", {
        name: data.name,
        dirname: dirname
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  app.removeWindow(WIN_ID);
}
