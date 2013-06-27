import 'conductor' as Conductor;

// Lookup a url in the manifest for this card
var cardEnv = function(cardId) {
  // assume the manifest is already loaded, this is likely brittle
  var manifest = Glazier.Pane.find(cardId).get('cardManifest.manifest');

  var env = (/glazier\.herokuapp\.com/.test(window.location.hostname)) ? 'prod' : 'dev';

  if (manifest) {
    return manifest.env[env];
  }
};

var OauthService = Conductor.Oasis.Service.extend({
  oauthController: null,

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method loginWithGithub
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param githubData {Object}
    */
    authorize: function(promise, params) {
      // params.authorizeUrl
      // params.exchangeUrl TODO in future we could consider lack of exchange as implicit flow

      function success(accessToken) {
        promise.resolve(accessToken);
      }

      function failure(e) {
        promise.reject(e);
      }

      // check if we already have an access token for this authorize_url in the session
      var self = this;
      if (params.exchangeUrl) {
        this.authorize(params.authorizeUrl).then(function (authCode) {
          return self.exchange(params.exchangeUrl, authCode);
        }).then(success, failure);
      } else {
        var redirectUri = window.location.origin + '/api/oauth/callback';
        var clientId = cardEnv(this.sandbox.card.id).oauthClientId;

        this.authorize(params.authorizeUrl, clientId, redirectUri).then(success, failure);
      }
    }
  },

  /*
    @public

    @method authorize
    @param  authorizeUrl {String}
  */
  authorize: function (authorizeUrl, clientId, redirectUri) {
    var oauthOptions = {
      authorizeUrl: authorizeUrl,
      clientId: clientId,
      redirectUri: redirectUri
    };
    return this.oauthController.beginFlow(oauthOptions);
  },

  /*
    @public

    @method exchange
    @param  exchangeUrl {String}
    @param  authCode    {String}
  */
  exchange: function (exchangeUrl, authCode) {
    // return ajax promise for exchange authCode for accessToken
    return Ember.$.ajax({
      type: 'post',
      url: exchangeUrl,
      dataType: 'text',
      data: {
        code: authCode
      }
    });
  }
});

export = OauthService;
