var loadEmberApp = function() {
  var App = Ember.Application.create({
    rootElement: '#card'
  });

  App.ApplicationController = Ember.ArrayController.extend({
    repositoryName: null
  });

  App.deferReadiness();
  requireModule('templates');
  return App;
};

export loadEmberApp;
