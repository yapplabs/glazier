module.exports = {
  scripts: {
    files: ['app/**', 'cards/**', 'vendor/**', 'test/**',  'templates/**'],
    tasks: ['lock', 'build', 'unlock', 'jshint', 'qunit:all'],
    options: {
      nospawn: true
    }
  }
};
