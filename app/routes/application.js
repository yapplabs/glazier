var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    var cardManager = this.container.lookup('cardManager:main');
    var authPane = Glazier.Pane.find('7f878b1a-34af-42ed-b477-878721cbc90d');
    var authCard = cardManager.load(authPane);

    controller.set('authCard', authCard);

    var user = getUserFromCookie();
    if (user) {
      this.controllerFor('user').set('content', user);
    }
  }
});

function getUserFromCookie(){
  var cookies = document.cookie.split(/\s*;\s*/);
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i],
        match = /^login=.+?\-(.+)/.exec(cookie);
    if (match) {
      return JSON.parse(decodeURIComponent(match[1]));
    }
  };
  return null;
}

export = ApplicationRoute;
