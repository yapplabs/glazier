var Router = Ember.Router.extend({
  location: 'hash'
});

Router.map(function() {
  this.route('dashboard', { path: '/:github_user/:github_repo' });
  this.route('notFound');
  this.route('rateLimitExceeded');
  this.route('error');
});

Router.router.log = Ember.Logger.debug;

export default Router;
