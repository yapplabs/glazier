Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.requireCSS('/cards/github-repositories.css');

import loadEmberApp from 'app/application';

var App;
var card = Conductor.card({
  consumers: {
    'github:authenticated:read': Conductor.Oasis.Consumer,
    repository: Conductor.Oasis.Consumer
  },
  render: function (intent, dimensions) {
    if (!dimensions) { dimensions = {width:500,height:500}; }
    document.body.innerHTML = "<div id=\"card\"></div>";
    this.resize(dimensions);
    App.advanceReadiness();
  },

  activate: function() {
    console.log("activate github-repositories");
    var card = this;
    App = loadEmberApp();
    App.ApplicationController = Ember.ArrayController.extend();
    App.ApplicationRoute = Ember.Route.extend({
      setupController: function(controller, model) {
        this._super(controller, model);
        var repositoryService = card.consumers['repository'];
        var currentRepoRequest = repositoryService.request('getRepository');
        currentRepoRequest.then(function(repoName) {
          controller.set('currentRepository', repoName);
        });
      },

      model: function(){
        var _apiService = card.consumers['github:authenticated:read'];
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

export { card };
