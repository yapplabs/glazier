import Resolver from 'resolver';

var App = Ember.Application.create({
  modulePrefix: 'app',
  rootElement: '#card',
  resolver: Resolver
});

App.deferReadiness();
requireModule('templates');

export default App;
