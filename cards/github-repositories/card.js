import Consumer from 'conductor';

Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.require('/vendor/ember_card_bridge.js');
Conductor.require('/vendor/loader.js');

Conductor.requireCSS('/css/glazier_card.css');
Conductor.requireCSS('card.css');

var card = Conductor.card({
  consumers: {
    authenticatedGithubApi: Conductor.Oasis.Consumer.extend({
      getRepositories: function(){
        if (card.data.user) {
          return this.request("ajax", {
            url: '/user/repos',
            dataType: 'json'
          });
        }
      }
    })
  },

  App: null,

  render: function (intent, dimensions) {
    if (!document.getElementById('card') ){
      document.body.innerHTML = "<div id=\"card\"></div>";
    }

    return this.App.render(intent, dimensions);
  },

  activate: function() {
    Conductor.Oasis.configure('eventCallback', Ember.run);

    console.log("activate github-repositories");
    this.App = requireModule('app/application');
    this.App.register('card:main', this, { instantiate: false });
  },

  metadata: {
    document: function(promise) {
      promise.resolve({
        title: "Github Respositories"
      });
    },
    card: function() {
      return {
        isEditable: false
      };
    }
  }
});

export default card;
