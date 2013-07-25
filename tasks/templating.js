var path = require('path'),
  manifestUrl = require('../grunt-utils/manifest_url.js').manifestUrl;

module.exports = function(grunt){
  grunt.registerTask('index.html', 'process index.html', function() {
    var template = grunt.file.read('public/index.html');
    var manifestContents;
    var manifest;
    var assetHost = grunt.config.get('pkg').assetHost || '';
    if (process.env.GLAZIER_ENV === "prod") {
      manifest = grunt.file.readJSON('tmp/manifest.json');
    }

    var indexContents = grunt.template.process(template, {
      data: {
        manifestUrl: manifestUrl(manifest),
        manifest: JSON.stringify(manifest || {}),
        assetHost: assetHost
      }
    });

    grunt.file.write("tmp/public/index.html", indexContents);
  });
};
