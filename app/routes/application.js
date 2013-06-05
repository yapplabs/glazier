var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    var cardRegistry = this.container.lookup('cardRegistry:main');
    var authCard = cardRegistry.load('/cards/github-auth/manifest.json');
    controller.set('authCard', authCard);
  }
});

export ApplicationRoute;
