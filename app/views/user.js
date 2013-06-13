var UserView = Ember.View.extend({
  classNames: ['user'],
  click: function(){
    if (this.get('controller.isLoggedIn')) {
      alert('LOG OUT!');
    } else {
      this.startGithubOauth();
    }
  },
  startGithubOauth: function(){
    var githubUri = "https://github.com/login/oauth/authorize?scope=user,public_repo" +
      "&client_id=" + this.get('controller.githubClientId');
    window.open(githubUri, "authwindow", "menubar=0,resizable=1,width=960,height=410");
    var self = this;
    function onmessage(e) {
      self.handleOauthCode(e);
      window.removeEventListener("message", onmessage);
    }
    window.addEventListener("message", onmessage);
  },
  handleOauthCode: function(event){
    if (event.origin !== document.location.origin) {
      Ember.Logger.debug('Invalid origin: ' + event.origin + ' vs ' + document.location.origin);
      return;
    }
    this.get('controller').send('exchangeGithubOauthCode', event.data);
  }
});

export = UserView;
