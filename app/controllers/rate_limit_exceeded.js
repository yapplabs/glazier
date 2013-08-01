var RateLimitExceededController = Ember.Controller.extend({
  needs: ['user'],
  isLoggedIn: Ember.computed.alias('controllers.user.isLoggedIn'),
  previousTransition: null,
  reset: null
});
export default RateLimitExceededController;
