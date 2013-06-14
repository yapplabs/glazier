module.exports = {
  js: {
    src: ['tmp/**/*.js'],
    dest: 'tmp/dist/card.js',
    options: {
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'tmp/dist/card.css'
  }
};
