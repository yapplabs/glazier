module.exports = {
  scripts: {
    files: [
      'app/**',
      'cards/**',
      '!cards/*/node_modules/**',
      'vendor/**',
      'test/**',
      'templates/**',
      //'stylesheets/**',
      'public/**/*'],
    tasks: ['lock', 'build', 'templateCSS', 'unlock', 'jshint', 'qunit:all'],
    options: {
      nospawn: true
    }
  },
  sass: {
    files: [
      'stylesheets/**'
    ],
    tasks: ['sass', 'templateCSS'],
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
