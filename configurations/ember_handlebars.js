module.exports = {
  compile: {
    options: {
      processName: function(filename) {
        return filename.replace(/templates\//,'').replace(/\.handlebars$/,'');
      }
    },
    files: {
      "tmp/public/glazier/templates.js": "templates/*.handlebars",
      "tmp/public/cards/github-issues/templates/templates.js": "cards/github-issues/templates/*.handlebars"
    }
  }
};
