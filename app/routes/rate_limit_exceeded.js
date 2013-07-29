var RateLimitExceededRoute = Ember.Route.extend({
  beforeModel: function (transition) {
    transition.method(null);
  },
  events: {
    userDidChange: function(){
      this.router.handleURL(this.router.location.getURL());
    }
  }
});

export default RateLimitExceededRoute;
