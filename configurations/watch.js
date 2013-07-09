module.exports = {
  scripts: {
    files: [
      'app/**',
      'cards/**',
      '!cards/*/node_modules/**',
      'vendor/**',
      'test/**',
      'templates/**',
      'stylesheets/**',
      'public/**/*'],
    tasks: ['lock', 'build', 'templateCSS', 'unlock', 'jshint', 'qunit:all'],
    options: {
      nospawn: true
    }
  }
};
