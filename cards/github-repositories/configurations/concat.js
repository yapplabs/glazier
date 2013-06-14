module.exports = {
  js: {
    src: ['tmp/**/*.js'],
    dest: 'dist/github-repositories/card.js',
    options: {
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'dist/github-repositories/card.css'
  }
};
