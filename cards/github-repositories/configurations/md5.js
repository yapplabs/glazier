var grunt = require('grunt');

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
      keepExtension: true
    }
  }
};
