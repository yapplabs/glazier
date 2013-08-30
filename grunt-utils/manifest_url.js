var url = require('url'),
  grunt = require('grunt');

module.exports = {
  manifestUrl: function(manifest) {
    return function(path) {
      if(process.env.GLAZIER_ENV !== "prod") { return path; }
      var parsed = url.parse(path, true);

      var pathname = parsed.pathname;
      var minifiedPathname = pathname.replace(/\.(js|css)$/, '.min.$1');

      var path = manifest[minifiedPathname] || manifest[pathname];

      if (!path) {
        throw "No file found in manifest for path " + pathname;
      } else {
        console.log("Found entry for path " + pathname);
      }

      var assetHost = grunt.config.process('<%= pkg.assetHost %>');
      var parts = {
        pathname: assetHost + path,
        hash: parsed.hash,
        query: grunt.util._.extend({}, parsed.query, {"cors-fix": "1"})
      };

      console.log(path + " -> " + url.format(parts));

      return url.format(parts);
    };
  }
};
