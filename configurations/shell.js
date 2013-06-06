var fs = require('fs')


function cardGruntCommand(cardName) {
  var cmd = "pushd cards/" + cardName + " && grunt && popd"
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
    command: fs.readdirSync('cards').map(cardGruntCommand).join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  }
}
