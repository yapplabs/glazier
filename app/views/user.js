var UserView = Ember.View.extend({
  classNames: ['user'],
  click: function(evt){
    if ($(evt.target).hasClass('logout') || $(evt.target).parent().hasClass('logout')) {
      return; // the logout button has it's own action trigger
    }

    if (this.get('controller.isLoggedIn')) {
      this.get('controller').send('clickedUser');
    } else {
      this.startGithubOauth();
    }
  },
  startGithubOauth: function(){
    this.get('controller').set('isLoggingIn', true);

    var githubUri = "https://github.com/login/oauth/authorize?scope=user:email,public_repo" +
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

export default UserView;
