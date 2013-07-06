/*
  Make substitutions for templated parts of files where substitutions
  need to happen after finger-printed keys generated.
 */

module.exports = function(grunt){
  var taskName = "css_templating"

  //can add additional files here
  var templateFiles = ['css/glazier.css']

  var description = "process " + taskName;
  grunt.registerTask(taskName, description, function() {
    for (var i=0; i<templateFiles.length; i++) {
      var templateFile = templateFiles[i];
      //always generate file for dev
      template_dev_file(grunt, templateFile, devConfig);
      if(process.env.GLAZIER_ENV === "prod") {
        template_prod_file(grunt, templateFile);
      }
    }
  });
};


//processed dev file => tmp/public
var devConfig = {
  tempDir: "tmp",
  templateDir: "public",
  buildDir: "public",
  sourceFile: function(template){ return [this.tempDir, this.templateDir, template].join("/"); },
  writeFile: function(template){ return [this.tempDir, this.buildDir, template].join("/"); },
  getData: function(){ return data; },
  data: {
    manifestUrl: function(path) {
      return path;
    }
  }
}

function template_dev_file(grunt, templatePath, config) {
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
function template_prod_file(grunt, templatePath) {
  var manifest = grunt.file.readJSON('tmp/manifest.json');
  var md5File = getMD5Filename(grunt, manifest, templatePath);
  var template = grunt.file.read(md5File);
  var assetHost = grunt.config.get('pkg').assetHost || '';

  var indexContents = grunt.template.process(template, {
    data: {
      manifestUrl: function(path) {
        if (!manifest[path]) {
          throw "No file found in manifest for path " + path;
        } else {
          console.log("Found entry for path " + path);
        }
        return grunt.config.process('<%= pkg.assetHost %>') + manifest[path]; //.replace(/(-[^-]+)\.js$/, '$1.js');
      },
      manifest: JSON.stringify(manifest || {}),
      assetHost: assetHost
    }
  });
  grunt.file.write(md5File, indexContents);
}

function getMD5Filename(grunt, manifest, path) {
  var file =  manifest["/"+path];
  if (!file) {
    throw "No file found in manifest for path " + path;
  } else {
    var md5FileArray = file.split("/");
    var md5File =  md5FileArray[md5FileArray.length-1];
    var pathArray = path.split("/");
    pathArray.pop();

  }
  return "tmp/md5/" + pathArray.join("/") + "/" + md5File;
}
