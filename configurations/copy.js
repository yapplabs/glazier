module.exports = {
  main: {
    files: [
      {
        expand: true,
        cwd: 'public/',
        src: ['**'],
        dest: 'tmp/public/'
      }
    ]
  },

  test: {
    files: [
      {
        expand: true,
        cwd: 'test/',
        src: ['index.html'],
        dest: 'tmp/public/test'
    }
  ]},

  fixtures: {
    files: [
      {
        expand: true,
        cwd: 'test/',
        src: ['fixtures/**'],
        dest: 'tmp/public/test'
    }
  ]},

  cards: {
    files: [
      {
        expand: true,
        cwd: 'cards',
        src: ['**', '!**/*.js', '!**/*.handlebars'],
        dest: 'tmp/public/cards'
      }
    ]
  },

  vendor: {
    files: [
      {
        expand: true,
          cwd: 'vendor',
        src: ['**'],
        dest: 'tmp/public/vendor'
      }
    ]
  }
};
