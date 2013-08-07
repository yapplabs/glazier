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

grunt.event.on('watch', acumulateChanges);

grunt.registerTask('smartBuild', 'braux', function(){
  var changesJSON = readChanges();

  var changes = Object.keys(changesJSON);
  var done = this.async();

  var changedFilesWithinCards = changes.filter(byRegex(/^cards\//));
  var changedFiles            = changes.filter(byNegatedRegex(/^cards\//));
  var changedCards            = grunt.util._.unique(changedFilesWithinCards.map(cardName));

  console.log('files', changedFiles);
  console.log('cardsFiles', changedFilesWithinCards);
  console.log('cards', changedCards);

  updateChanges();

  var tasks = ['concat'];

  // exclude cards... for now
  if (changedFiles.filter(byRegex(/\.js$/)).length > 0) {
    tasks.push('build:js');
  }

  if (changedFiles.filter(byRegex(/\.(scss|css)$/)).length > 0) {
    tasks.push('build:css');
  }

  tasks.push('copy_glazier');
  tasks.push('concat');
  tasks.push('jsframe');

  grunt.task.run(tasks);


  RSVP.all(changedCards.map(buildCard)).
    then(copyCards).
    then(null, rethrow)
});

function acumulateChanges(action, filepath, target) {
  var changes = readChanges();

  changes[filepath] = action;

  updateChanges(changes);
}

function copyCards(value){
  grunt.task.run('copy:cards');
  return value;
}

function buildCard(card) {
  console.log("Running: cd cards/" + card + " && grunt");

  function printOutput(value) {
    console.log(value[0]);
    return card;
  }

  return exec("cd cards/" + card + " && grunt").then(printOutput);
}

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

function updateChanges(json) {
  json = json || {};

  grunt.file.write('tmp/changes.json', JSON.stringify(json));
}

function readChanges() {
  var json;

  try {
    json = grunt.file.readJSON('tmp/changes.json');
  } catch(error) {
    json = {};
  }

  return json;
}

function cardName(path) {
  return path.split('/')[1];
}

function rethrow(reason) {
  setTimeout(function(){ throw reason; })
  throw reason;
}
