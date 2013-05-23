Conductor.require('http://code.jquery.com/jquery-1.9.1.min.js');
Conductor.requireCSS('/cards/github-auth/card.css');

Conductor.card({
  consumers: {
    configuration: Conductor.Oasis.Consumer.extend({}),
    fullXhr: Conductor.Oasis.Consumer.extend({})
  },
  render: function (intent, dimensions) {
    if (!dimensions) { dimensions = {width:500,height:500} };
    document.body.innerHTML = "<div><div>Hooray world!</div><button id=\"github_button\">Log In with GitHub</button></div>";
    this.resize(dimensions);
  },

  activate: function() {
    console.log("activate");
    var card = this;
    var _configurationService = this.consumers.configuration;
    githubClientIdPromise = _configurationService.request('configurationValue', 'github_client_id');
    $('body').on('click', '#github_button', function(){
      githubClientIdPromise.then(function(githubClientId){
        var githubUri = "https://github.com/login/oauth/authorize?scope=gist" +
          "&client_id=" +  githubClientId;
        window.open(githubUri, "authwindow", "menubar=0,resizable=1,width=960,height=410");
      });
      return false;
    });

    window.addEventListener("message", function(event) {
      // if (event.origin !== window.location.origin) {
      //   console.log("got unknown message", event);
      //   return;
      // }
      var authCode = event.data;
      console.log("we got a code " + authCode);
      var _fullXhrService = card.consumers.fullXhr;
      _fullXhrService.request('ajax', {
        type: 'post',
        url: 'http://localhost:8000' + "/api/oauth/github/exchange?code=" + authCode
      }).then(function(data) {
        var accessToken = data;
        // view.set('controller.githubAccessToken', accessToken);
        console.log("My access token is ", accessToken);
      });
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
