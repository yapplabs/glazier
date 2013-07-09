## Glazier deployment Overview

Deployment of Glazier is broken into distinct parts:

  1. Deploying the rails project to Heroku
  2. Uploading javascript and css assets to S3
  3. Updating the production database with the contents of `index.html`
  4. Ingesting card manifests


## Dependencies

 * [Heroku Toolbelt](https://toolbelt.heroku.com/)
 * [heroku-surrogate](https://github.com/tpope/heroku-surrogate)

Notes:

 * `heroku` commands are run from within `glazier-server`
 * `grunt` commands are run from within `glazier`

## Deploying the rails project to Heroku

### One-time setup:

In `glazier/glazier-server/`:

    git remote add prod git@heroku.com:glazier.git

### Deploying changes

Once you have created the `prod` remote for heroku, you can deploy with:

    git push prod master

This will push the latest server code to heroku.  Run migrations with:

    heroku run rake db:migrate

[heroku-surrogate](https://github.com/tpope/heroku-surrogate) can be used to run migrations before deploying code,
useful when updates aren't compatible with the unmigrated database:

    # check current status of prod DB against local migrations folder
    heroku surrogate rake db:migrate:status

    # run pending local migrations against prod
    heroku surrogate rake db:migrate

    # deploy new server code that depends on latest migrations
    git push prod master

## Uploading javascript and css assets to S3

Glazier's approach for deploying the client-side application is to create fingerprinted javascript and md5 files, and upload them to s3.

### Setup

Set the following environment variables with the s3 key and secret for the bucket you want to deploy to:

    GLAZIER_S3_KEY
    GLAZIER_S3_SECRET

In the `package.json` file, ensure that the correct `assetHost` value is specified.  For glazier we are using "http://glazier.s3.amazonaws.com" as our asset host.

### Deployment

Running `grunt deploy` will result in fingerprinted asset files being uploaded to s3.

It will also create a `tmp/public/index.html` file that uses the urls of those assets.

## Updating the production database with the contents of `index.html`

Part of what `grunt deploy` does is upload the `index.html` that uses the assets that it uploads to s3.

It does this by running:

    heroku surrogate rake 'glazier:ingest_as_current[../tmp/public/index.html]' --app glazier

## Uploading assets of cards in `glazier/cards` to s3

in `glazier/`

    grunt deployCards

will run `grunt deploy` in each folder within `glazier/cards/`, and then a `heroku surrogate rails run` command that ingests the manifests that were just uploaded.

## Ingesting card manifests

This guide assumes you have deployed card assets, including a `manifest.json` file for each card you want to use.

Start the production console with `heroku run console`.

Then, with each `manifest.json` url, run:

    PaneType.ingest(url)

You can also reingest all previously-ingested manifests with

    PaneType.reingest_all


