module.exports = {
  all: {
    files: [
      {
        expand: true,
        src: ['app/**', 'css/**', '!**/*.js'],
        dest: 'tmp'
      }
    ]
  }
};
