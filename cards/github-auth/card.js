Conductor.require('/vendor/jquery.js');
Conductor.requireCSS('/cards/github-auth.css');

import 'app/consumers/test' as TestConsumer;
import 'app/consumers/authenticated_api' as AuthentiatedApiConsumer;

var card;

card = Conductor.card({
  consumers: {
    configuration: Conductor.Oasis.Consumer,
    fullXhr: Conductor.Oasis.Consumer,
    'github:authenticated:read': AuthentiatedApiConsumer,
    userStorage: Conductor.Oasis.Consumer,
    login: Conductor.Oasis.Consumer,
    test: TestConsumer
  },

  render: function (intent, dimensions) {
    if (!dimensions) {
      dimensions = {width:500,height:500};
    }

    document.body.innerHTML = "<div><div>Hooray world!</div>"
    this.resize(dimensions);
  },

  accessTokenPromise: new Conductor.Oasis.RSVP.Promise(),

  activate: function() {
    console.log("activate github-auth");

    var card = this;
    var _configurationService = this.consumers.configuration;
    var githubClientIdPromise = _configurationService.request('configurationValue', 'github_client_id');

  },

  metadata: {
    document: function(promise) {
      promise.resolve({
        title: "Github Auth"
      });
    }
  },

  resize: function(dimensions) {
    var width = Math.min(dimensions.width, 500);
    var height = Math.min(dimensions.height, 500);
    $('body>div').css({
      width: width
    });
  }
});

export = card;
