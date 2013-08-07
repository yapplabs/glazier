import Consumer from 'conductor';

Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.require('/vendor/ember_card_bridge.js');
Conductor.require('/vendor/loader.js');

Conductor.requireCSS('/css/glazier_card.css');
Conductor.requireCSS('card.css');

import TestConsumer from 'app/consumers/test';

var card = Conductor.card({
  consumers: {
    'test': TestConsumer,
    'authenticatedGithubApi': Conductor.Oasis.Consumer,
    'unauthenticatedGithubApi': Conductor.Oasis.Consumer
  },

  App: null,

  render: function (intent, dimensions) {
    if (!document.getElementById('card')){
      document.body.innerHTML = "<div id=\"card\"></div>";
    }

    return this.App.render(intent, dimensions);
  },

  activate: function() {
    Conductor.Oasis.configure('eventCallback', Ember.run);
    this.App = requireModule('app/application');
    this.App.register('card:main', this, { instantiate: false });
  },

  metadata: {
    document: function() {
      return {
        title: "Github Issues"
      };
    },
    card: function() {
      return {
        isEditable: false
      };
    }
  }
});

export default card;
