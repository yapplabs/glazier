var ApplicationRoute = Ember.Route.extend({
  beforeModel: function(){
    var userId = getUserIdFromCookie();
    if (!userId) { return; } // no cookie yet - not logged in

    var userController = this.controllerFor('user');
    return Ember.$.ajax({
      url: '/api/user',
      dataType: 'json'
    }).then(function(data) {
      userController.set('content', data && data.user);
    });
  }
});

function getUserIdFromCookie(){
  var cookies = document.cookie.split(/\s*;\s*/);
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i],
        match = /^login=.+?\-(.+)/.exec(cookie);
    if (match) {
      return JSON.parse(decodeURIComponent(match[1])).github_id;
    }
  }
  return null;
}

export default ApplicationRoute;
