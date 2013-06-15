module.exports = {
  js: {
    src: ['../../vendor/loader.js', '../../vendor/oasis.amd.js', 'tmp/**/*.js'],
    dest: 'dist/github-repositories/card.js',
    options: {
      header: 'hi',
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'dist/github-repositories/card.css'
  }
};
