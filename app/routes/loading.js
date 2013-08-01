var LoadingRoute = Ember.Route.extend({
  // Disable default rendering behavior.
  renderTemplate: Ember.K,

  activate: function() {
    this.controllerFor('loading').set('isLoading', true);
  },

  deactivate: function() {
    this.controllerFor('loading').set('isLoading', false);
  }
});

export default LoadingRoute;
