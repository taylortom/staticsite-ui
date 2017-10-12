var ipc = require("electron").ipcMain;
var app = require("../main");

ipc.on("site.add", addSite);
ipc.on("site.save", saveSite);

var WIN_ID = "addSite";

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
      app.windows.main.webContents.send("site.added", {
        name: data.name,
        dirname: dirname
      });
    })
    .catch(function(err) {
      console.log(err);
    });
  app.removeWindow(WIN_ID);
}
