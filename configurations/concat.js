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
      footer: "self.Oasis = requireModule('oasis'); self.Conductor = requireModule('conductor'); requireModule('conductor/card'); self.oasis = new self.Oasis(); self.oasis.autoInitializeSandbox();"
    }
  }
};
