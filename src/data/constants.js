var path = require("path");

module.exports = {
  Root: path.resolve(__dirname, "..", ".."),
  Folders: {
    Sites: 'sites',
    Pages: '_pages'
  },
  DefaultPageFileType: '.md',
  BlankSiteRepo: 'https://github.com/taylortom/staticsite-skele.git'
};
