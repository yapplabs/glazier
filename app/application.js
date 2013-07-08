import Router from 'glazier/router';
import Store from 'glazier/store';
import Resolver from 'resolver';

var Application = Ember.Application.extend({
  modulePrefix: 'glazier',
  Router: Router,
  Store: Store,
  resolver: Resolver
});

export default Application;
