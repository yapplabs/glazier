function cardGruntCommand(cardName) {
  return "pushd cards/" + cardName + " && grunt && popd";
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
    command: [
      'github-auth',
      'github-issues',
      'github-repositories'
    ].map(cardGruntCommand).join(' && '),
    options: {
      stdout: true,
      stderr: true,
      failOnError: true
    }
  }
}
