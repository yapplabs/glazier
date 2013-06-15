module.exports = {
  js: {
    src: ['tmp/**/*.js'],
    dest: 'dist/dev/github-issues/card.js',
    options: {
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'dist/dev/github-issues/card.css'
  }
};
