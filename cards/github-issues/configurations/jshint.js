module.exports = {
  all: {
    src: ['Gruntfile.js', 'tmp/**/*.js'],
    options: {
      reporter: 'tasks/jshintreporter.js',
      jshintrc: '.jshintrc',
      force: true
    }
  }
};
