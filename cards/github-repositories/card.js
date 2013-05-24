Conductor.require('http://code.jquery.com/jquery-1.9.1.min.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.requireCSS('/cards/github-repositories/card.css');

var App;

Conductor.card({
  consumers: {
    credentialedGithubApi: Conductor.Oasis.Consumer
  },
  render: function (intent, dimensions) {
    if (!dimensions) { dimensions = {width:500,height:500} };
    document.body.innerHTML = "<div id=\"card\"></div>";
    this.resize(dimensions);
    App.advanceReadiness()
  },

  activate: function() {
    console.log("activate github-repositories");
    var card = this;
    App = Ember.Application.create({
      rootElement: '#card'
    });
    App.deferReadiness()
    Ember.TEMPLATES['application'] = Ember.Handlebars.compile(
      "<h3>My Repositories</h3><ul>{{#each}}<li>{{name}}</li>{{/each}}</ul>"
    );
    App.ApplicationController = Ember.ArrayController.extend();
    App.ApplicationRoute = Ember.Route.extend({
      model: function(){
        var _apiService = card.consumers.credentialedGithubApi;
        return _apiService.request("ajax", {
          url: '/user/repos',
          dataType: 'json'
        });
      }
    });
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
