var ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    var GITHUB_CLIENT_ID = Ember.$('meta[name=github_client_id]').attr('content');
    var view = this;
    document.getElementById('github_button').addEventListener('click', function(){
      var githubUri = "https://github.com/login/oauth/authorize?scope=gist" +
        "&client_id=" +  GITHUB_CLIENT_ID;
      window.open(githubUri, "authwindow", "menubar=0,resizable=1,width=960,height=410");
      return false;
    });

    window.addEventListener("message", function(event) {
      if (event.origin !== window.location.origin) {
        Ember.Logger.debug("got unknown message", event);
        return;
      }
      var authCode = event.data;
      Ember.Logger.debug("we got a code " + authCode);
      Ember.$.ajax({
        type: 'post',
        url: window.location.origin + "/api/oauth/github/exchange?code=" + authCode
      }).then(function(data) {
        var accessToken = data;
        view.set('controller.githubAccessToken', accessToken);
        Ember.Logger.debug("My access token is ", accessToken);
      });
    });
  }
});

export ApplicationView;
