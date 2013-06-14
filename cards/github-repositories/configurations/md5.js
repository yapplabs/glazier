var grunt = require('grunt');

var CARD_URL_REGEXP = /card-[\w\d]{32}\.js$/;

module.exports = {
  compile: {
    files: [{
      expand: true,
      cwd: 'tmp/dist',
      src: ['**/*'],
      dest: 'tmp/md5/',
      filter: 'isFile'
    }],

    options: {
      encoding: null,
      keepBasename: true,
      keepExtension: true,
      after: function (fileChanges, options) {
        var manifest, key, file, from, to, name, assetHost;

        name = grunt.config.process('<%= pkg.glazierConfig.repositoryName %>');
        assetHost = grunt.config.process('<%= pkg.glazierConfig.assetHost %>');

        manifest = {
          assets: {},
          consumes: grunt.config.process('<%= pkg.glazierConfig.consumes%>')
        };

        for (key in fileChanges) {
          file = fileChanges[key];

          from = file.oldPath.replace(/^tmp\/dist/, '');
          to = file.newPath.replace(/^tmp\/md5/, assetHost + '/assets/cards/' + name + '/assets');

          if (CARD_URL_REGEXP.test(file.newPath)) {
            manifest.cardUrl = to;
          } else {
            manifest.assets[from] = to;
          }
        }

        if (!manifest.cardUrl) {
          console.error(manifest);
          throw new Error("Missing cardUrl in: `" + name + "` manifest");
        }

        grunt.file.write('tmp/manifest.json', JSON.stringify(manifest));
      }
    }
  }
};
