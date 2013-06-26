var ApplicationRoute = Ember.Route.extend({
  beforeModel: function(){
    var user = getUserFromCookie();
    this.controllerFor('user').set('content', user);
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
  }
  return null;
}

export = ApplicationRoute;
