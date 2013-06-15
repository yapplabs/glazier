module.exports = {
  main: {
    files: [
      {
        expand: true,
        src: ['app/**', 'css/**', '!**/*.js'],
        dest: 'tmp'
      }
    ]
  },
  manifest: {
    files: [{
      expand: true,
      flatten: true,
      cwd: 'tmp/',
      src: ['manifest.json', 'md5/*.js', 'md5/*.css'],
      dest: 'dist/prod/',
      filter: 'isFile'
    }]
  }
};
