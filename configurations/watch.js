module.exports = {
  scripts: {
    files: [
      'app/**',
      'cards/**',
      '!node_modules/**',
      '!tmp/**',
      '!cards/*/node_modules/**',
      '!cards/*/tmp/**',
      '!cards/*/dist/**',
      'vendor/**',
      'test/**',
      'templates/**',
      'public/**/*'],
    tasks: ['lock', 'build', 'templateCSS', 'unlock', 'jshint', 'qunit:all'],
    options: {
      debounceDelay: 200
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
