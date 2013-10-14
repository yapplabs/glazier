var fs = require('fs');
var grunt = require('grunt');
var opts = {
  stdout: true,
  stderr: true,
  failOnError: true
};

var cards = fs.readdirSync('cards').filter(isCardDir).filter(isAllowedCard);

function isAllowedCard(dirname){
  if (process.env.CARDS) {
    var cardsToBuild = process.env.CARDS.split(',');
    return cardsToBuild.indexOf(dirname) !== -1;
  } else {
    return true;
  }
}

function isCardDir(dirname){
  return dirname[0] != ".";
}

function echoCommand(dirname, text) {
  return "(echo '-> " + dirname + ": " + text + "') && ";
}

function commandWithEcho(dirname, command) {
  return echoCommand(dirname, command) + "(cd cards/" + dirname + " && " +  command +")";
}

function cardGruntCommand(dirname) {
  return commandWithEcho(dirname, "grunt");
}

function cardGruntDeployCommand(dirname) {
  return commandWithEcho(dirname, "grunt deploy");
}

function cardNpmInstallCommand(dirname) {
  return commandWithEcho(dirname, "npm install");
}

function cardNpmRefreshCommand() {
  return "rm -rf cards/*/node_modules";
}

function cardPackage(dirname) {
  return grunt.file.readJSON('cards/' + dirname + '/package.json' );
}

function ingestManifestsCommand() {
  var manifestPaths = [];

  cards.forEach(function(dirname) {
    var name = cardPackage(dirname).name;
    var manifestPath = 'cards/' + dirname + '/dist/dev/' + name + '/manifest.json';
    manifestPaths.push('../' + manifestPath);
  });

  var cmd = '(cd glazier-server && bundle exec rake "glazier:card:ingest[' + manifestPaths.join('|') + ']")';
  return cmd;
}

function herokuIngestCommand(dirname) {
  var pkg = cardPackage(dirname);
  var glazierConfig = pkg.glazierConfig;

  if (!glazierConfig.assetHost) {
    throw new Error("Missing property: glazierConfig.assetHost");
  }

  if (!pkg.name) {
    throw new Error("Missing property: pkg.name");
  }

  var url = glazierConfig.assetHost + '/assets/cards/' + pkg.name + '/manifest.json';
  var cmd = "(cd glazier-server && heroku surrogate rails runner \"PaneType.ingest('" + url + "')\" --app glazier)";
  return cmd;
}

herokuIngestIndexCommand = "(cd glazier-server && heroku surrogate rake 'glazier:ingest_as_current[../tmp/public/index.html]' --app glazier)";

function cloneHelper(repositoryFullName) {
  var parts = repositoryFullName.split('/');
  var githubUserName = parts[0];
  var repositoryName = parts[1];
  var cloneFolderPath = '../' + repositoryName;
  var cloneUrl = 'git@github.com:' +  repositoryFullName + '.git';

  var cloneUnlessDirectoryExists = 'if [ ! -d ' + cloneFolderPath + ' ]; then';
  cloneUnlessDirectoryExists += ' git clone ' + cloneUrl + ' ' + cloneFolderPath + ' ;';
  cloneUnlessDirectoryExists += ' else ';
  cloneUnlessDirectoryExists += ' echo "' + cloneFolderPath + ' already exists. skipping.";';
  cloneUnlessDirectoryExists += ' fi ';

  return cloneUnlessDirectoryExists;
}

function runInCardCommand(cmd) {
  return function(dirname) {
    return "(cd cards/" + dirname + " && " +  cmd +")";
  };
}

function runInCardsCommand(cmd) {
  return cards.map(runInCardCommand(cmd)).join(" && ");
}

module.exports = {
  runInCards: {
    command: runInCardsCommand(grunt.option("cmd") || grunt.option("c")),
    options: opts
  },
  updateAllTheThings: {
    command: [
      'git pull --ff-only',
      'npm install',
      '(cd glazier-server && bundle && bundle exec rake db:reset)',
      'for card in `ls cards`; do (cd cards/$card && git pull --ff-only && rm -rf node_modules && npm install); done',
      'grunt ingest',
      'grunt ingestCards'
    ].join('&&')
  },
  glazierServer: {
    command: [
      "cd glazier-server",
      "PORT=3040 NOEXEC_DISABLE=1 foreman start"
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
    command: cards.map(cardNpmRefreshCommand).join(' && '),
    options: opts
  },
  npmInstallForCards: {
    command: cards.map(cardNpmInstallCommand).join(' && '),
    options: opts
  },
  buildCards: {
    command: cards.map(cardGruntCommand).join(' && '),
    options: opts
  },
  ingestCardManifests: {
    command: ingestManifestsCommand(),
    options: opts
  },
  deployCards: {
    command: cards.map(cardGruntDeployCommand).join(' && '),
    options: opts
  },
  herokuIngestCards: {
    command: cards.filter(isCardDir).map(herokuIngestCommand).join(' && '),
    options: opts
  },
  cloneCards: {
    command: [
      cloneHelper("yapplabs/glazier-github-issues"),
      "ln -sfn ../../glazier-github-issues cards/github-issues",

      cloneHelper("yapplabs/glazier-github-issue"),
      "ln -sfn ../../glazier-github-issue cards/github-issue",

      cloneHelper("yapplabs/glazier-github-repositories"),
      "ln -sfn ../../glazier-github-repositories cards/github-repositories",

      cloneHelper("yapplabs/glazier-github-stars"),
      "ln -sfn ../../glazier-github-stars cards/github-stars",

      cloneHelper("yapplabs/glazier-github-people"),
      "ln -sfn ../../glazier-github-people cards/github-people",

      cloneHelper("yapplabs/glazier-stackoverflow"),
      "ln -sfn ../../glazier-stackoverflow/cards/auth cards/stackoverflow-auth",
      "ln -sfn ../../glazier-stackoverflow/cards/questions cards/stackoverflow-questions",

      cloneHelper("yapplabs/glazier-markdown-editor"),
      "ln -sfn ../../glazier-markdown-editor cards/markdown-editor",

      cloneHelper("yapplabs/glazier-travis-build"),
      "ln -sfn ../../glazier-travis-build cards/travis-build"
    ].join(" && "),
    options: opts
  }
};
