module.exports = {
  compile: {
    options: {
      processName: function(filename) {
        return filename.replace(/templates\//,'').replace(/\.handlebars$/,'');
      }
    },
    files: {
      "tmp/public/glazier/templates.js": "templates/*.handlebars"
    }
  }
};
