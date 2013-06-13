Conductor.require('/vendor/jquery.js');
Conductor.requireCSS('/cards/github-auth.css');

import 'app/consumers/test' as TestConsumer;
import 'app/consumers/authenticated_api' as AuthentiatedApiConsumer;
import 'app/consumers/unauthenticated_api' as UnauthenticatedApiConsumer;

var card;

card = Conductor.card({
  consumers: {
    configuration: Conductor.Oasis.Consumer,
    fullXhr: Conductor.Oasis.Consumer,
    'github:unauthenticated:read': UnauthenticatedApiConsumer,
    'github:authenticated:read': AuthentiatedApiConsumer,
    userStorage: Conductor.Oasis.Consumer,
    login: Conductor.Oasis.Consumer,
    test: TestConsumer
  },

  render: function (intent, dimensions) {
    if (!dimensions) {
      dimensions = {width:500,height:500};
    }

    document.body.innerHTML = "<div><div>Hooray world!</div><button id=\"github_button\">Log In with GitHub</button></div>";
    this.resize(dimensions);
  },

  accessTokenPromise: new Conductor.Oasis.RSVP.Promise(),

  activate: function() {
    console.log("activate github-auth");

    var card = this;
    var _configurationService = this.consumers.configuration;
    var githubClientIdPromise = _configurationService.request('configurationValue', 'github_client_id');

    $('body').on('click', '#github_button', function(){

      githubClientIdPromise.then(function(githubClientId){
        var githubUri = "https://github.com/login/oauth/authorize?scope=user,public_repo" +
          "&client_id=" +  githubClientId;
        window.open(githubUri, "authwindow", "menubar=0,resizable=1,width=960,height=410");
      }).then(null, Conductor.error);

      return false;
    });

    window.addEventListener("message", function(event) {

      var authCode = event.data;
      var fullXhrService = card.consumers.fullXhr;

      fullXhrService.request('ajax', {
        type: 'post',
        url: 'http://localhost:8000' + "/api/oauth/github/exchange?code=" + authCode
      }).then(function(data) {
        var accessToken = data;

        console.log('card.accessTokenPromise.resolve', accessToken);
        card.accessTokenPromise.resolve(accessToken);

        // view.set('controller.githubAccessToken', accessToken);
        return card.consumers.login.request('loginWithGithub', {accessToken: accessToken}).then(function(){
          return card.consumers.userStorage.request('setItem', 'accessToken', accessToken).then(function(){
            // console.log("I saved my access token: ", accessToken);
          });
        });
      }).then(null, Conductor.error);
    });
  },

  metadata: {
    document: function(promise) {
      promise.resolve({
        title: "Github Auth"
      });
    }
  },

  resize: function(dimensions) {
    var width = Math.min(dimensions.width, 500);
    var height = Math.min(dimensions.height, 500);
    $('body>div').css({
      width: width
    });
  }
});

export = card;
