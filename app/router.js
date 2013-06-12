var Router = Ember.Router.extend({
  location: 'history'
});

Router.map(function() {
  this.route('dashboard', { path: '/:github_user/:github_repo' });
});

export = Router;
