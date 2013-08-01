var RateLimitExceededRoute = Ember.Route.extend({
  beforeModel: function (transition) {
    transition.method(null);
  },
  events: {
    userDidChange: function(){

      if (!this.controllerFor('user').get('isLoggedIn')) { return; }

      var rateLimitController = this.controllerFor('rateLimitExceeded'),
          previousTransition = rateLimitController.get('previousTransition');

      if (previousTransition) {
        previousTransition.retry();
        rateLimitController.set('previousTransition', null);
      }
    }
  }
});

export default RateLimitExceededRoute;
