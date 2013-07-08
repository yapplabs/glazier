var ErrorRoute = Ember.Route.extend({
  beforeModel: function (transition) {
    transition.method(null);
  }
});

export default ErrorRoute;
