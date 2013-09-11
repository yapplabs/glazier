import Router from 'glazier/router';
import Resolver from 'resolver';

var Application = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  modulePrefix: 'glazier',
  Router: Router,
  Resolver: Resolver
});

export default Application;
