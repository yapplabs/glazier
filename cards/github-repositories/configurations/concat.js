module.exports = {
  js: {
    src: ['tmp/**/*.js'],
    dest: 'tmp/dist/github-repositories.js',
    options: {
      footer: "requireModule('card');"
    }
  },
  css: {
    src: ['tmp/css/style.css'],
    dest: 'tmp/dist/github-repositories.css'
  }
};
