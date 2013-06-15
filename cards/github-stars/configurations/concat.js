module.exports = {
  js: {
    src: ['../../vendor/loader.js', '../../vendor/oasis.amd.js', 'tmp/**/*.js'],
    dest: 'dist/github-stars/card.js',
    options: {
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'dist/github-stars/card.css'
  }
};
