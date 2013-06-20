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
  },

  conductor: {
    src: ['tmp/public/vendor/loader.js', 'tmp/public/vendor/conductor/**/*.js'],
    dest: 'tmp/public/vendor/conductor.js',
    options: {
      footer: "requireModule('conductor');"
    }
  }
};
