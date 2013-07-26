var grunt = require('grunt'),
  manifestUrl = require('../grunt-utils/manifest_url.js').manifestUrl;

/*
  Make substitutions for templated parts of files where substitutions
  need to happen after finger-printed keys generated.
 */

module.exports = function(grunt) {
  var taskName = "templateCSS"

  //can add additional files here
  var templateFiles = ['css/glazier.css', 'css/glazier_card.css'];

  var description = "process " + taskName;
  grunt.registerTask(taskName, description, function() {
    for (var i=0; i<templateFiles.length; i++) {
      var templateFile = templateFiles[i];
      //always generate file for dev
      templateDevFile(templateFile, devConfig);
      if(process.env.GLAZIER_ENV === "prod") {
        templateProdFile(templateFile);
      }
    }
  });
};


//processed dev file => tmp/public
var devConfig = {
  tempDir: "tmp",
  templateDir: "public",
  buildDir: "public",
  sourceFile: function(template){
    return [this.tempDir, this.templateDir, template].join("/");
  },
  writeFile: function(template){
    return [this.tempDir, this.buildDir, template].join("/");
  },
  getData: function(){ return data; },
  data: {
    manifestUrl: function(path) {
      return path;
    }
  }
}

function templateDevFile(templatePath, config) {
  var template = grunt.file.read(config.sourceFile(templatePath));
  var indexContents = grunt.template.process(template, { data: config.data});
  console.log(config.writeFile(templatePath));
  grunt.file.write(config.writeFile(templatePath), indexContents);
}


//processed prod file => tmp/md5

/*
  eventually might want to extract a config and
  unify the process for dev/prod generation but prod side
  needs a bit of unraveling
*/
function templateProdFile(templatePath) {
  var manifest = grunt.file.readJSON('tmp/manifest.json');
  var md5File = getMD5Filename(manifest, templatePath);
  var template = grunt.file.read(md5File);
  var assetHost = grunt.config.get('pkg').assetHost || '';

  var indexContents = grunt.template.process(template, {
    data: {
      manifestUrl: manifestUrl(manifest),
      manifest: JSON.stringify(manifest || {}),
      assetHost: assetHost
    }
  });
  grunt.file.write(md5File, indexContents);
}

function getMD5Filename(manifest, path) {
  var file =  manifest["/"+path];

  if (!file) {
    throw new Error("No file found in manifest for path: " + path);
  } else {
    var md5FileArray = file.split("/");
    var md5File =  md5FileArray[md5FileArray.length-1];
    var pathArray = path.split("/");
    pathArray.pop();
  }

  return "tmp/md5/" + pathArray.join("/") + "/" + md5File;
}
