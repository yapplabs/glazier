module.exports = function(grunt){
  grunt.registerTask('index.html', 'process index.html', function() {
    var template = grunt.file.read('public/index.html');
    var manifestContents;
    var manifest;
    var cdnHost = grunt.config.get('pkg').cloudfrontHost || '';
    if (process.env.GLAZIER_ENV === "prod") {
      manifest = grunt.file.readJSON('tmp/manifest.json');
    }

    var indexContents = grunt.template.process(template, {
      data: {
        manifestUrl: function(path) {
          if(process.env.GLAZIER_ENV === "prod") {
            path = path.replace(/\.js$/, '.min.js');
            /* Our MD5 task adds the -MD5 directly before the .js */
            console.log(process);
            return grunt.config.process('<%= pkg.cloudfrontHost %>') + manifest[path]; //.replace(/(-[^-]+)\.js$/, '$1.js');
          } else {
            return path;
          }
        },
        manifest: JSON.stringify(manifest || {}),
        cdnHost: cdnHost
      }
    });

    grunt.file.write("tmp/public/index.html", indexContents);
  });
};
