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
    if (!dimensions) { dimensions = {width:500,height:500}; }
    document.body.innerHTML = "<div id=\"card\"></div>";
    this.resize(dimensions);
    this.App.advanceReadiness();
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

export default card;
