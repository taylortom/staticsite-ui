module.exports = {
  slugify: function(str) {
    return str.replace(/\s|\//g, "-");
  }
}
