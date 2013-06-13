var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    var cardManager = this.container.lookup('cardManager:main');
    var authPane = Glazier.Pane.find('7f878b1a-34af-42ed-b477-878721cbc90d');
    var authCard = cardManager.load(authPane);

    controller.set('authCard', authCard);
  },
  events: {
    clickLoginButton: function(){
      alert("Doesn't do anything yet");
    }
  }
});

export = ApplicationRoute;
