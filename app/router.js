var Router = Ember.Router.extend({
  location: 'hash'
});

Router.map(function() {
  this.route('dashboard', { path: '/:github_user/:github_repo' });
});

Router.router.log = Ember.Logger.debug;

export = Router;
