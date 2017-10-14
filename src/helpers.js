module.exports = {
  slugify: function(str) {
    return str.replace(/\s|\//g, "-");
  },

  getIconForFiletype: function(filetype) {
    switch(filetype) {
      case 'markdown':
      case '.md':
        return 'fa-file-o';
      case '.html':
        return 'fa-file-code-o';
      default:
        return 'fa-question';
    }
  }
}
