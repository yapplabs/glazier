var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    var cardRegistry = this.container.lookup('cardRegistry:main');
    var authPane = Glazier.Pane.find('7f878b1a-34af-42ed-b477-878721cbc90d');
    var authCard = cardRegistry.load(authPane);
    controller.set('authCard', authCard);
  }
});

export ApplicationRoute;
