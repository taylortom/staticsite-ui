module.exports = {
  slugify: function(str) {
    return str.replace(/\s|\//g, "-");
  },

  getIconForFiletype: function(filetype) {
    switch(filetype.toLowerCase()) {
      case 'markdown':
      case '.md':
      case '.txt':
        return 'fa-file-text-o';
      case '.css':
      case '.html':
      case '.js':
      case '.less':
        return 'fa-code';
      case '.png':
      case '.jpeg':
      case '.jpg':
        return 'fa-file-image-o';
      default:
        return 'fa-question';
    }
  }
}
