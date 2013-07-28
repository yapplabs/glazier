import Conductor from 'conductor';

// Lookup a url in the manifest for this card
var cardEnv = function(cardId) {
  // assume the manifest is already loaded, this is likely brittle
  var manifest = Glazier.Pane.find(cardId).get('paneType.manifest');

  var env = (/glazier\.herokuapp\.com/.test(window.location.hostname)) ? 'prod' : 'dev';

  if (manifest) {
    return manifest.env[env];
  }
};

var OauthService = Conductor.Oasis.Service.extend({
  oauthController: null, // injected

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method authorize
      @param params {Object}
    */
    authorize: function(params) {
      // params.authorizeUrl
      // params.exchangeUrl (TODO: in the future we could consider lack of exchange as implicit flow)

      // check if we already have an access token for this authorize_url in the session
      var self = this;
      if (params.exchangeUrl) {
        return this.authorize(params.authorizeUrl).then(function (authCode) {
          return self.exchange(params.exchangeUrl, authCode);
        });
      } else {
        var redirectUri = window.location.origin + '/api/oauth/callback';
        var clientId = cardEnv(this.sandbox.card.id).oauthClientId;

        return this.authorize(params.authorizeUrl, clientId, redirectUri);
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
    return this.oauthController.startOauthFlow(oauthOptions);
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

export default OauthService;
