var url = require('url'),
  grunt = require('grunt');

module.exports = {
  manifestUrl: function(manifest) {
    return function(path) {
      if(process.env.GLAZIER_ENV !== "prod") { return path; }
      var parsed = url.parse(path, true);

      if (!manifest[parsed.pathname]) {
        throw "No file found in manifest for path " + parsed.pathname;
      } else {
        console.log("Found entry for path " + parsed.pathname);
      }

      var assetHost = grunt.config.process('<%= pkg.assetHost %>');
      var parts = {
        pathname: assetHost + manifest[parsed.pathname],
        hash: parsed.hash,
        query: grunt.util._.extend({}, parsed.query, {"cors-fix": "1"})
      };

      console.log(path + " -> " + url.format(parts));

      return url.format(parts);
    };
  }
};
