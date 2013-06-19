var NotFoundRoute = Ember.Route.extend({
  beforeModel: function (transition) {
    transition.method(null);
  }
});

export = NotFoundRoute;
