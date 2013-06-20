var fs = require('fs')

var isCardDir = function (dir){
  return dir[0] != ".";
}

function cardGruntCommand(cardName) {
  var cmd = "cd cards/" + cardName + " && grunt && cd ../.."
  return cmd;
}

function cardNpmInstallCommand(cardName) {
  var cmd = "cd cards/" + cardName + " && npm install && cd ../.."
  return cmd;
}

function cardIngestManigestCommand(cardName) {
  var manifestPath = 'cards/' + cardName + '/dist/dev/' + cardName + '/manifest.json';
  var cmd = 'cd glazier-server && bundle exec rake "glazier:card:ingest[../' + manifestPath + ']" && cd ..'
  return cmd;
}

module.exports = {
  glazierServer: {
    command: [
      "cd glazier-server",
      "PORT=3040 foreman start"
    ].join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  },
  ingest: {
    command: [
      "cd glazier-server",
      "bundle exec rake 'glazier:ingest_as_current[../tmp/public/index.html]'"
    ].join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  },
  npmInstallForCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardNpmInstallCommand).join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  },
  buildCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardGruntCommand).join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  },
  ingestCardManifests: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardIngestManigestCommand).join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  }
}
