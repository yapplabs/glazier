var glob = require('glob');
var cards = glob.sync('*', {cwd: 'cards'});

var cardDists = cards.map(function(card){
  return {
    expand: true,
    cwd: 'cards/' + card + '/dist/dev',
    src: ['**/*'],
    dest: 'tmp/public/cards/',
    filter: 'isFile'
  };
});

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
  vendor: {
    files: [
      {
        expand: true,
          cwd: 'vendor',
        src: ['**'],
        dest: 'tmp/public/vendor'
      }
    ]
  },
  cards: {
    files: cardDists
  }
};
