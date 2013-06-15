module.exports = {
  js: {
    src: ['tmp/**/*.js'],
    dest: 'dist/github-issues/card.js',
    options: {
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'dist/github-issues/card.css'
  }
};
