module.exports = {
  all: {
    files: [
      'app/**',
      'stylesheets/**',
      'cards/**',
      '!node_modules/**',
      '!tmp/**',
      '!cards/*/node_modules/**',
      '!cards/*/tmp/**',
      '!cards/*/dist/**',
      'vendor/**',
      'test/**',
      'templates/**',
      'public/**/*'],
    tasks: ['lock', 'smartBuild', 'unlock', 'jshint', 'qunit:all'],
    options: {
      nospawn: true,
      debounceDelay: 200
    }
  },
  css: {
    files: [
      'tmp/public/css/*.css'
    ],
    options: {
      livereload: true
    }
  }
};

var RSVP = require('rsvp');
var grunt = require('grunt');
var exec = RSVP.denodeify(require('child_process').exec);

process.changedFiles = Object.create(null);

grunt.event.on('watch', function(action, filepath, target) {
  process.changedFiles[filepath] = action;
});

function byRegex(regex) {
  return function(string) {
    return regex.test(string);
  }
}

function byNegatedRegex(regex) {
  return function(string) {
    return !regex.test(string);
  }
}
var RSVP = require('rsvp');

grunt.registerTask('smartBuild', 'braux', function(){
  var changes = Object.keys(process.changedFiles);
  var done = this.async();

  var changedFilesWithinCards = changes.filter(byRegex(/^cards\//));
  var changedFiles            = changes.filter(byNegatedRegex(/^cards\//));
  var changedCards            = grunt.util._.unique(changedFilesWithinCards.map(function(path){
    return path.split('/')[1];
  }));

  console.log('files', changedFiles);
  console.log('cardsFiles', changedFilesWithinCards);
  console.log('cards', changedCards);

  process.changedFiles = Object.create(null);

  var tasks = ['concat'];

  // exclude cards... for now
  if (changedFiles.filter(byRegex(/\.js$/)).length > 0 ) {
    tasks.push('build:js');
  }

  if (changedFiles.filter(byRegex(/\.(scss|css)$/)).length > 0) {
    tasks.push('build:css');
  }

  tasks.push('copy_glazier');
  tasks.push('concat');
  tasks.push('jsframe');

  grunt.task.run(tasks);

  function rethrow(reason) {
    setTimeout(function(){ throw reason; })
    throw reason;
  }

  RSVP.all(changedCards.map(function(card){
    console.log("Running: cd cards/" + card + " && grunt");
    return exec("cd cards/" + card + " && grunt");
  })).
    then(function(value){
      // TODO: better output..
      console.log(value[0][0]);

      grunt.task.run('copy:cards');
      return value;
    }).
    then(null, rethrow)
});

