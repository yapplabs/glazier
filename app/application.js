import Router from 'glazier/router';
import Store from 'glazier/store';

var Application = Ember.Application.extend({
  Router: Router,
  Store: Store
});

export Application;
