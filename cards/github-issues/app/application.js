var loadEmberApp = function() {
  var App = Ember.Application.create({
    rootElement: '#card'
  });

  App.ApplicationController = requireModule('app/controllers/application');

  App.deferReadiness();
  requireModule('templates');
  return App;
};

export loadEmberApp;
