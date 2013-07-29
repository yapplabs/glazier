var RateLimitExceededController = Ember.Controller.extend({
  needs: ['user'],
  isLoggedIn: Ember.computed.alias('controllers.user.isLoggedIn'),
  reset: null
});
export default RateLimitExceededController;
