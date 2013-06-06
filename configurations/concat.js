module.exports = {
  main: {
    src: ['tmp/public/glazier/**/*.js'],
    dest: 'tmp/public/glazier.js'
  },

  tests: {
    src: ['tmp/public/test/**/*.js', '!tmp/public/test/fixtures/**'],
    dest: 'tmp/public/test.js'
  },

  auth: {
    src: ['tmp/public/cards/github-auth/**/*.js'],
    dest: 'tmp/public/cards/github-auth/all.js',
    options: {
      footer: "requireModule('github-auth/card');"
    }
  },

  repos: {
    src: ['tmp/public/cards/github-repositories/**/*.js'],
    dest: 'tmp/public/cards/github-repositories/all.js',
    options: {
      footer: "requireModule('github-repositories/card');"
    }
  }
};
