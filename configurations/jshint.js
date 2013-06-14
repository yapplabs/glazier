module.exports = {
  all: {
    // TODO: Run jshint on individual files when jshint supports ES6 modules
    src: [
      'Gruntfile.js',
      'tmp/public/**/*.js',
      '!tmp/public/glazier.js',
      '!tmp/public/vendor/**',
      '!tmp/public/test.js',
      '!tmp/public/cards/**'
    ],
    options: {
      reporter: 'tasks/jshintreporter.js',
      jshintrc: '.jshintrc',
      force: true
    }
  }
};
