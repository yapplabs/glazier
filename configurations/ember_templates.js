module.exports = {
  compile: {
    options: {
      templateRegistration: function(name, content) {
        return "define('glazier/" + name + "', [], function() { return " + content + "; });";
      }
    },
    files: {
      "tmp/public/glazier/templates.js": "templates/**/*.handlebars"
    }
  }
};
