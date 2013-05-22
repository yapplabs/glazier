glazier
=======
[![Build Status](https://travis-ci.org/yapplabs/glazier.png?branch=master)](https://travis-ci.org/yapplabs/glazier)

Dashboard for Github projects using Conductor.js and Oasis.js

# Getting Started

````
git clone git://github.com/yapplabs/glazier
git submodule update --init
pushd glazier-server
be rake db:migrate
popd
npm install
grunt ingest
grunt
````
