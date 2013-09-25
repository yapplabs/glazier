module.exports = {
  compile: {
    options: {
      generateRegistrationJs: function(processedTemplates) {
        return processedTemplates.map(function(processedTemplate){
          return "define('glazier/" + processedTemplate.name + "', [], function(){ return " + processedTemplate.js + "; });";
        }).join("\n");
      }
    },
    files: {
      "tmp/public/glazier/templates.js": "templates/**/*.handlebars"
    }
  }
};
