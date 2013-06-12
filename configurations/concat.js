module.exports = {
  main: {
    src: ['tmp/public/glazier/**/*.js'],
    dest: 'tmp/public/glazier.js'
  },

  css: {
    src: ['tmp/public/css/**/*.css'],
    dest: 'tmp/public/glazier.css'
  },

  tests: {
    src: ['tmp/public/test/**/*.js', '!tmp/public/test/fixtures/**'],
    dest: 'tmp/public/test.js'
  }
};
