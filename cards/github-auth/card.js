Conductor.require('http://code.jquery.com/jquery-1.9.1.min.js');
Conductor.requireCSS('/cards/github-auth/card.css');

var card;
var ApiConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    ajax: function (promise, ajaxOpts) {
      console.log('card.accessTokenPromise.then');
      card.accessTokenPromise.then(function (accessToken) {
        if (!ajaxOpts.data)
          ajaxOpts.data = {};
        ajaxOpts.url = 'https://api.github.com' + ajaxOpts.url;
        ajaxOpts.data.access_token = accessToken;
        card.consumers.fullXhr.request('ajax', ajaxOpts).then(function (data) {
          promise.resolve(data);
        }, function (e) {
          promise.reject(e);
        });
      });
    }
  }
});

card = Conductor.card({
  consumers: {
    configuration: Conductor.Oasis.Consumer,
    fullXhr: Conductor.Oasis.Consumer,
    'github:authenticated:read': ApiConsumer,
    userStorage: Conductor.Oasis.Consumer,
    test: Conductor.Oasis.Consumer.extend({})
  },
  render: function (intent, dimensions) {
    if (!dimensions) { dimensions = {width:500,height:500}; }
    document.body.innerHTML = "<div><div>Hooray world!</div><button id=\"github_button\">Log In with GitHub</button></div>";
    this.resize(dimensions);
  },
  accessTokenPromise: new Conductor.Oasis.RSVP.Promise(),

  activate: function() {
    // console.log("activate github-auth");
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
      // console.log("we got a code " + authCode);
      var fullXhrService = card.consumers.fullXhr;
      fullXhrService.request('ajax', {
        type: 'post',
        url: 'http://localhost:8000' + "/api/oauth/github/exchange?code=" + authCode
      }).then(function(data) {
        var accessToken = data;
        console.log('card.accessTokenPromise.resolve', accessToken);
        card.accessTokenPromise.resolve(accessToken);
        // view.set('controller.githubAccessToken', accessToken);
        card.consumers.userStorage.request('setItem', 'accessToken', accessToken).then(function(){
          // console.log("I saved my access token: ", accessToken);
        });
      }, function(e){
        console.error(e);
      });
    });

    setTimeout(function(){
      if (card.consumers.test) {
        card.consumers.test.request('runTest').then(function(testFnString) {
          var testFn = new Function('return ' + testFnString)();
          testFn.call(window, card);
        });
      }
    }, 100);
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
