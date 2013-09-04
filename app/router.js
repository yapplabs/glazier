var Router = Ember.Router.extend({
  location: 'hash'
});

Router.map(function() {
  this.resource('dashboard', { path: '/:github_user/:github_repo' }, function() {
    this.route('section', { path: '/:section_slug' });
  });
  this.route('notFound');
  this.route('rateLimitExceeded');
  this.route('error');
});

Router.router.log = Ember.Logger.debug;

export default Router;
