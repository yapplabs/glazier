module.exports = {
  js: {
    src: ['tmp/**/*.js'],
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
