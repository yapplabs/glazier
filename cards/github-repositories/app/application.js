var loadEmberApp = function() {
  var App = Ember.Application.create({
    rootElement: '#card'
  });

  App.deferReadiness();
  requireModule('templates');
  return App;
};

export loadEmberApp;
