import Router from 'glazier/router';
import Store from 'glazier/store';
import Resolver from 'resolver';

var Application = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  modulePrefix: 'glazier',
  Router: Router,
  Store: Store,
  Resolver: Resolver
});

export default Application;
