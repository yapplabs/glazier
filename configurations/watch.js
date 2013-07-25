module.exports = {
  scripts: {
    files: [
      'app/**',
      'cards/**',
      '!cards/*/node_modules/**',
      '!cards/*/tmp/**',
      '!cards/*/dist/**',
      'vendor/**',
      'test/**',
      'templates/**',
      'public/**/*'],
    tasks: ['lock', 'build', 'templateCSS', 'unlock', 'jshint', 'qunit:all'],
    options: {
      interrupt: true
    }
  },
  sass: {
    files: [
      'stylesheets/**'
    ],
    tasks: ['sass', 'templateCSS']
  },
  css: {
    files: [
      'tmp/public/css/*.css'
    ],
    options: {
      livereload: true
    }
  }
};
