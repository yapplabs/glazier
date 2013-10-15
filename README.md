glazier
==============
[![Build Status](https://travis-ci.org/yapplabs/glazier.png?branch=master)](https://travis-ci.org/yapplabs/glazier)

Dashboard for Github projects using [Conductor.js](https://github.com/tildeio/conductor.js) and
[Oasis.js](https://github.com/tildeio/oasis.js).


## Setup

### Install Dependencies

For the proxy:

[Grunt](http://gruntjs.com/)

    npm install -g grunt-cli

For the Glazier server:

[Ruby 1.9.3](http://www.ruby-lang.org/en/downloads/)

[Postgres 9.2.x](http://postgresapp.com/)

### Get the project

    git clone git://github.com/yapplabs/glazier
    cd glazier
    git submodule update --init

There are two components to set up:  the Glazier proxy and the back-end rails server (Glazier server).

Glazier server is a submodule.  The project is [here](https://github.com/yapplabs/glazier-server)

### Set up Githup API credentials

Create a Github app for your Glazier app at http://github.com/settings/applications/new

In the form enter:

    Application Name: anything you like (e.g. "glazier-dev")
    Main URL:         http://localhost:8000
    Callback URL:     http://localhost:8000/api/oauth/github/callback

When you submit the form you will get a **client id** and **client secret**. Set the following environment variables:

    GLAZIER_GITHUB_CLIENT_ID=<git client id>
    GLAZIER_GITHUB_CLIENT_SECRET=<git client secret>
    #these are needed in the windows running both the proxy and the server


### Setup the database and prepare the server

    cd glazier-server
    bundle install
    rake db:create
    rake db:migrate

### Run npm install

    # from the top glazier directory
    npm install


### Clone card repositories and symlink them into the glazier/cards directory

    # from the top glazier directory
    grunt cloneCards
    ls -al ./cards/ # to see where the symlinks point

### Install the Glazier proxy dependencies and start the proxy

    # navigate to the top glazier directory
    # make sure client id and client secret are set in this window
    bundle install
    grunt              //interrupt this task when it reaches the Waiting state
    grunt ingest
    grunt ingestCards
    grunt

### Start the server

    grunt server   //from the top glazier directory

### Navigate to the app in your browser

    http://localhost:8000/

## Adding Node Packages

Glazier uses [npm shrinkwrapping](https://npmjs.org/doc/shrinkwrap.html) to prevent
dependency version problems.  If you add or change dependencies in the package.json
files (either container or cards), make sure to run `npm shrinkwrap` in the appropriate
place.

## Running specs

Start the grunt server with `grunt`, then visit:

    http://localhost:8000/test/index.html

QUnit tests that are able to be run in Phantom (see https://github.com/yapplabs/glazier/issues/1)
will run as you make changes or you can run them with `grunt qunit:all`

glazier-server uses RSpec for unit tests. To run them:

    bundle exec rake

To automatically execute glazier-server specs as you update code and specs:

    bundle exec guard

## Default Cards

`grunt cloneCards` clones and symlinks the following repositories into the `glazier/cards` folder:

  * [github-issue](https://github.com/yapplabs/glazier-github-issue)
  * [github-issues](https://github.com/yapplabs/glazier-github-issues)
  * [github-people](https://github.com/yapplabs/glazier-github-people)
  * [github-repositories](https://github.com/yapplabs/glazier-github-repositories)
  * [github-stars](https://github.com/yapplabs/glazier-github-stars)
  * [stackoverflow-auth](https://github.com/yapplabs/glazier-stackoverflow)
  * [stackoverflow-questions](https://github.com/yapplabs/glazier-stackoverflow)
  * [markdown-editor](https://github.com/yapplabs/glazier-markdown-editor)
  * [travis-build](https://github.com/yapplabs/glazier-travis-build)

## Troubleshooting

**500 Internal Server Error**

If this occurs immediately after you update the project, its possible the database structure has
changed and you haven't migrated.  Run:

    #in glazier/glazier-server directory
    rake db:migrate

**NPM, Grunt Errors**

If you're using Glazier for the first time and get errors running `npm install`, make sure
your version of npm is current. Outdated versions will give errors such as telling you npm
can't find a certain module which it subsequently lists as installed (nice!).

If grunt commands just won't run, sometimes its because node modules have gotten out of
sync. Try deleting the `/node_modules` subdirectory and re-running `npm install`


### Ziniki Notes

Ziniki is the land of unicorns and blueberries.

To Enable Ziniki mode:

1. public/index.html uncomment Ziniki related script tags
2. and start glazier with: `DONT_PROXY_INDEX=true grunt fastBoot`

```javascript
  // quick helpers
  function login() {
     Glazier.__container__.lookup('controller:user').set('model', {});
   }

   function logout() {
     Glazier.__container__.lookup('controller:user').set('model', null);
   }

  function admin() {
    Glazier.__container__.lookup('controller:dashboard').set('isAdmin', true);
  }
```

