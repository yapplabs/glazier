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

### Install the Glazier proxy dependencies and start the proxy

    #open a separate window and navigate to the top glazier directory
    #make sure client id and client secret are set in this window
    bundle install
    npm install
    grunt              //interrupt this task when it reaches the Waiting state
    grunt ingest
    grunt ingestCards
    grunt

### Start the server

    grunt server   //from the top glazier directory

### Navigate to the app in your browser

    http://localhost:8000/api/

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

## Troubleshooting

**500 Internal Server Error**

If this occurs immediately after you update the project, its possible the database structure has
changed and you haven't migrated.  Run:

    #in glazier/glazier-server directory
    rake db:migrate
