var fs = require('fs');
var grunt = require('grunt');
var opts = {
  stdout: true,
  stderr: true,
  failOnError: true
};

var isCardDir = function (dir){
  return dir[0] != ".";
};

function cardGruntCommand(cardName) {
  var cmd = "cd cards/" + cardName + " && grunt && cd ../.."
  return cmd;
}

function cardGruntDeployCommand(cardName) {
  var cmd = "cd cards/" + cardName + " && grunt deploy && cd ../.."
  return cmd;
}

function cardNpmInstallCommand(cardName) {
  var cmd = "cd cards/" + cardName + " && npm install && cd ../.."
  return cmd;
}

function cardNpmRefreshCommand(cardName) {
  var cmd = "cd cards/" + cardName + " && rm -rf node_modules && npm install && cd ../.."
  return cmd;
}


function cardIngestManigestCommand(cardName) {
  var manifestPath = 'cards/' + cardName + '/dist/dev/' + cardName + '/manifest.json';
  var cmd = 'cd glazier-server && bundle exec rake "glazier:card:ingest[../' + manifestPath + ']" && cd ..'
  return cmd;
}

function herokuIngestCommand(cardName) {
  var deployJSON = grunt.file.readJSON('cards/' + cardName + '/package.json');
  var glazierConfig = deployJSON.glazierConfig;
  var url = glazierConfig.assetHost + '/assets/cards/' + glazierConfig.repositoryName + '/manifest.json';
  var cmd = "cd glazier-server && heroku surrogate rails runner \"PaneType.ingest('" + url + "')\" --app glazier && cd ..";
  return cmd;
}

herokuIngestIndexCommand = "cd glazier-server && heroku surrogate rake 'glazier:ingest_as_current[../tmp/public/index.html]' --app glazier && cd ..";

module.exports = {
  glazierServer: {
    command: [
      "cd glazier-server",
      "PORT=3040 foreman start"
    ].join(' && '),
    options: opts
  },
  ingest: {
    command: [
      "cd glazier-server",
      "bundle exec rake 'glazier:ingest_as_current[../tmp/public/index.html]'"
    ].join(' && '),
    options: opts
  },
  ingestIndex: {
    command: herokuIngestIndexCommand,
    options: opts
  },
  npmRefreshForCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardNpmRefreshCommand).join(' && '),
    options: opts
  },
  npmInstallForCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardNpmInstallCommand).join(' && '),
    options: opts
  },
  buildCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardGruntCommand).join(' && '),
    options: opts
  },
  ingestCardManifests: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardIngestManigestCommand).join(' && '),
    options: opts
  },
  deployCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardGruntDeployCommand).join(' && '),
    options: opts
  },
  herokuIngestCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(herokuIngestCommand).join(' && '),
    options: opts
  }
};
