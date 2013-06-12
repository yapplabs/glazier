import Router from 'glazier/router';
import Store from 'glazier/store';
import Resolver from 'glazier/resolver';

var Application = Ember.Application.extend({
  Router: Router,
  Store: Store,
  resolver: Resolver
});

export Application;
