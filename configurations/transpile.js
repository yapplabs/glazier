module.exports = {
  main: {
    type: "amd",
    moduleName: function(defaultModuleName){
      return 'glazier/' + defaultModuleName;
    },
    files: [{
      expand: true,
      cwd: 'app/',
      src: ['**/*.js'],
      dest: 'tmp/public/glazier'
    }]
  },

  tests: {
    type: "amd",
    files: [{
      expand: true,
      cwd: 'test/',
      src: ['**/*.js', '!fixtures/**'],
      dest: 'tmp/public/test/'
    }]
  },

  cardContainerTests: {
    type: "amd",
    files: [{
      expand: true,
      cwd: 'cards/',
      src: ['*/test/container_test.js'],
      dest: 'tmp/public/test/cards/'
    }]
  }
};
