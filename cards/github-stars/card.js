import 'conductor' as Conductor;

Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.require('/vendor/loader.js');
Conductor.requireCSS('/css/glazier_card.css');
Conductor.requireCSS('/cards/github-stars/card.css');

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

  App: null,

  render: function (intent, dimensions) {
    if (!dimensions) {
      dimensions = {
        width: 500,
        height: 300
      };
    }

    document.body.innerHTML = "<div id=\"card\"></div>";

    Ember.run(this.App, 'advanceReadiness');

    return this.App;
  },

  activate: function() {
    this.App = requireModule('app/application');
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
