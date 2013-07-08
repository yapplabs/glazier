import Consumer from 'conductor';
import IdentityConsumer from 'app/consumers/identity';

Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.require('/vendor/loader.js');
Conductor.requireCSS('/css/glazier_card.css');
Conductor.requireCSS('/cards/github-repositories/card.css');

var card = Conductor.card({
  consumers: {
    authenticatedGithubApi: Conductor.Oasis.Consumer.extend({
      getRepositories: function(){
        var consumer = this;
        return this.card.consumers.identity.getCurrentUser().then(function(userJson){
          if (userJson) {
            return consumer.request("ajax", {
              url: '/user/repos',
              dataType: 'json'
            });
          } else {
            return null;
          }
        });
      }
    }),
    repository: Conductor.Oasis.Consumer,
    identity: IdentityConsumer
  },

  App: null,

  render: function (intent, dimensions) {
    if (!dimensions) { dimensions = {width:500,height:500}; }
    document.body.innerHTML = "<div id=\"card\"></div>";
    this.resize(dimensions);
    this.App.advanceReadiness();
  },

  activate: function() {
    console.log("activate github-repositories");
    this.App = requireModule('app/application');
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
