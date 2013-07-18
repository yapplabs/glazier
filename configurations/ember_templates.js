module.exports = {
  compile: {
    options: {
      templateName: function(filename) {
        return filename.replace(/templates\//,'').replace(/\.handlebars$/,'');
      }
    },
    files: {
      "tmp/public/glazier/templates.js": "templates/*.handlebars"
    }
  }
};
