var grunt = require('grunt');

var assetHost = 'http://glazier.s3.amazonaws.com';

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
        var manifest, key, file, from, to, name;

        name = 'yapplabs/github-repositories'; // TODO dynamic

        manifest = {}; // TOOD load manifest options (like consumes)

        for (key in fileChanges) {
          file = fileChanges[key];

          from = file.oldPath.replace(/^tmp\/dist/, '');
          to = file.newPath.replace(/^tmp\/md5/, assetHost + '/assets/cards/' + name + '/assets');

          manifest[from] = to;
        }
        grunt.file.write('tmp/manifest.json', JSON.stringify(manifest));
      }
    }
  }
};
