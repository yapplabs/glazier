module.exports = {
  code: {
    type: "amd",
    files: [{
      expand: true,
      src: ['app/**/*.js', 'card.js'],
      dest: 'tmp/'
    }]
  },

  templates: {
    type: "amd",
    files: [{
      expand: true,
      cwd: 'tmp/',
      src: ['**/templates.js'],
      dest: 'tmp/'
    }]
  }
};
