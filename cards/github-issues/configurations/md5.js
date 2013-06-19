var grunt = require('grunt');

var CARD_URL_REGEXP = /card-[\w\d]{32}\.js$/;

module.exports = {
  compile: {
    files: [{
      expand: true,
      cwd: "dist/dev/<%= pkg.glazierConfig.shortName %>",
      src: ['**/*'],
      dest: 'tmp/md5/',
      filter: 'isFile'
    }],

    options: {
      encoding: null,
      keepBasename: true,
      keepExtension: true,
      after: function (fileChanges, options) {
        var manifest, key, file, from, to, repositoryName, assetHost;

        repositoryName = grunt.config.process('<%= pkg.glazierConfig.repositoryName %>');
        assetHost = grunt.config.process('<%= pkg.glazierConfig.assetHost %>');

        manifest = {
          name: repositoryName,
          consumes: grunt.config.process('<%= pkg.glazierConfig.consumes %>'),
          cardUrl: '',
          assets: {}
        };

        for (key in fileChanges) {
          file = fileChanges[key];

          from = file.oldPath.replace(/^dist\/dev/, '/cards');
          to = file.newPath.replace(/^tmp\/md5/, assetHost + '/assets/cards/' + repositoryName + '/assets');

          console.log('testing', file.newPath);
          if (CARD_URL_REGEXP.test(file.newPath)) {
            manifest.cardUrl = to;
          } else {
            manifest.assets[from] = to;
          }
        }

        if (!manifest.cardUrl) {
          console.error(manifest);
          throw new Error("Missing cardUrl in: `" + repositoryName + "` manifest");
        }

        grunt.file.write('tmp/manifest.json', JSON.stringify(manifest, null, 2));
      }
    }
  }
};
