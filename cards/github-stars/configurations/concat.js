module.exports = {
  js: {
    src: ['tmp/**/*.js'],
    dest: 'dist/dev/github-stars/card.js',
    options: {
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'dist/dev/github-stars/card.css'
  }
};
