import 'conductor' as Conductor;

Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.require('/vendor/loader.js');
Conductor.requireCSS('/css/card.css');
Conductor.requireCSS('/cards/github-issues/card.css');

import 'app/consumers/test' as TestConsumer;
import 'app/consumers/identity' as IdentityConsumer;

var card = Conductor.card({
  consumers: {
    'test': TestConsumer,
    'identity': IdentityConsumer,
    'repository': Conductor.Oasis.Consumer,
    'authenticatedGithubApi': Conductor.Oasis.Consumer,
    'unauthenticatedGithubApi': Conductor.Oasis.Consumer
  },

  render: function (intent, dimensions) {
    if (!dimensions) {
      dimensions = {
        width: 500,
        height: 2000
      };
    }

    document.body.innerHTML = "<div id=\"card\"></div>";

    Ember.run(App, 'advanceReadiness');

    return App;
  },

  activate: function() {
    window.App = requireModule('app/application');
  },

  metadata: {
    document: function(promise) {
      promise.resolve({
        title: "Github Issues"
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
