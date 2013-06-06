var fs = require('fs')

var isCardDir = function (dir){
  return dir[0] != ".";
}

function cardGruntCommand(cardName) {
  var cmd = "cd cards/" + cardName + " && grunt && cd ../.."
  console.log("Building card '" + cardName + "' with cmd: " + cmd)
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
  buildCards: {
    command: fs.readdirSync('cards').filter(isCardDir).map(cardGruntCommand).join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  }
}
