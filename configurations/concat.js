module.exports = {
  main: {
    src: ['tmp/public/glazier/**/*.js'],
    dest: 'tmp/public/glazier.js'
  },

  tests: {
    src: ['tmp/public/test/**/*.js', '!tmp/public/test/fixtures/**'],
    dest: 'tmp/public/test.js'
  },

  safe_almond: {
    src: ['tmp/public/vendor/almond.js'],
    dest: 'tmp/safe_almond.js',
    options: {
      banner: "if (typeof define !== 'function' && typeof require !== 'function') {",
      footer: "}"
    }
  },

  conductor: {
    src: ['tmp/safe_almond.js', 'tmp/public/vendor/conductor/**/*.js'],
    dest: 'tmp/conductor.js',
    options: {
      footer: "self.Oasis = require('oasis'); self.Conductor = require('conductor'); require('conductor/card'); self.oasis = new self.Oasis(); self.oasis.autoInitializeSandbox();"
    }
  }
};
