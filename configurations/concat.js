module.exports = {
  main: {
    src: ['tmp/public/glazier/**/*.js'],
    dest: 'tmp/public/glazier.js'
  },

  tests: {
    src: ['tmp/public/test/**/*.js', '!tmp/public/test/fixtures/**'],
    dest: 'tmp/public/test.js'
  },

  conductor: {
    src: ['tmp/public/vendor/loader.js', 'tmp/public/vendor/conductor/**/*.js'],
    dest: 'tmp/conductor.js',
    options: {
      footer: "window.Conductor = requireModule('conductor');"
    }
  }
};
