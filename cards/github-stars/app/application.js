import 'resolver' as Resolver;

var App = Ember.Application.create({
  modulePrefix: 'app',
  rootElement: '#card',
  resolver: Resolver
});

App.deferReadiness();
requireModule('templates');

export = App;
