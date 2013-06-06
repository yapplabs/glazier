module.exports = {
  scripts: {
    files: ['app/**', 'cards/**', 'vendor/**', 'test/**',  'templates/**'],
    Configs: ['lock', 'build', 'unlock', 'jshint', 'qunit:all'],
    options: {
      nospawn: true
    }
  }
};
