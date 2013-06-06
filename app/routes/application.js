var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    var cardRegistry = this.container.lookup('cardRegistry:main');
    var authCardModel = Glazier.Card.find('7f878b1a-34af-42ed-b477-878721cbc90d');
    var authCard = cardRegistry.load(authCardModel);
    controller.set('authCard', authCard);
  }
});

export ApplicationRoute;
