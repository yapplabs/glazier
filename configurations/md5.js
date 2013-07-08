var grunt = require('grunt');

module.exports = {
  compile: {
    files: [{
      expand: true,
      cwd: 'tmp/public',
      src: ['**/*', '!glazier/**/*', '!test/**/*'],
      dest: 'tmp/md5/',
      filter: 'isFile'
    }],
    options: {
      cmd: 'tmp/public/glazier',
      encoding: null,
      keepBasename: true,
      keepExtension: true,
      after: function (fileChanges, options) {
        var manifest, key, file, from, to;

        manifest = {};

        for (key in fileChanges) {
          file = fileChanges[key];

          from = file.oldPath.replace(/^tmp\/public/,'');
          to = file.newPath.replace(/^tmp\/md5/,'/assets');

          manifest[from] = to;
        }
        grunt.file.write('tmp/manifest.json', JSON.stringify(manifest, null, 2));
      }
    }
  }
};
