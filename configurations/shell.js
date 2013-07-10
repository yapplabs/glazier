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

function cardGruntCommand(dirname) {
  var cmd = "(cd cards/" + dirname + " && grunt)";
  return cmd;
}

function cardGruntDeployCommand(dirname) {
  var cmd = "(cd cards/" + dirname + " && grunt deploy)";
  return cmd;
}

function cardNpmInstallCommand(dirname) {
  var cmd = "(cd cards/" + dirname + " && npm install)";
  return cmd;
}

function cardNpmRefreshCommand() {
  var cmd = "rm -rf cards/*/node_modules";
  return cmd;
}

function pkgAt(path) {
  return grunt.file.readJSON(path + '/package.json' );
}

function cardIngestManifestCommand(dirname) {
  var name = pkgAt('cards/' + dirname).name;
  var manifestPath = 'cards/' + dirname + '/dist/dev/' + name + '/manifest.json';
  var cmd = '(cd glazier-server && bundle exec rake "glazier:card:ingest[../' + manifestPath + ']")';
  return cmd;
}

function herokuIngestCommand(dirname) {
  var deployJSON = pkgAt('cards/' + dirname);
  var glazierConfig = deployJSON.glazierConfig;
  var url = glazierConfig.assetHost + '/assets/cards/' + glazierConfig.repositoryName + '/manifest.json';
  var cmd = "(cd glazier-server && heroku surrogate rails runner \"PaneType.ingest('" + url + "')\" --app glazier)";
  return cmd;
}

herokuIngestIndexCommand = "(cd glazier-server && heroku surrogate rake 'glazier:ingest_as_current[../tmp/public/index.html]' --app glazier)";

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
    command: fs.readdirSync('cards').filter(isCardDir).map(cardIngestManifestCommand).join(' && '),
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
