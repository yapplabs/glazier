import Router from 'glazier/router';
import Store from 'glazier/store';

import 'glazier/initializers/github_auth_card' as githubAuthCardInitializer;

Ember.Application.initializer(githubAuthCardInitializer);

var Application = Ember.Application.extend({
  Router: Router,
  Store: Store
});

export Application;
