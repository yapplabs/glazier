import Conductor from 'conductor';

/* Diagram: http://www.websequencediagrams.com/cgi-bin/cdraw?lz=ICAgIENhcmQgLT4gQ29uc3VtZXI6IHJlcXVlc3Q6IGF1dGhvcml6ZShwYXJhbXMpCgAsBQAiByAtPiBTZXJ2aWNlABMhACEHIC0-IE9hdXRoQ29udHJvbGxlcjogc3RhcnRGbG93AFkFABAPAB0VY29uZmlybSB2aWEgbW9kYWwAIhhBdXRoV2luZG93OiBwb3AtdXAAgT0FAA0KAHwVcG9zdE1lc3NhZ2UoAIEnBmRlAIF1BgCBChMAgXkJACIIAIFiDi0-IDxzZXJ2ZXI-OiBQT1NUIGV4Y2hhbmdlVXJsLAAnDgAhCAAxBU9BdXRoIFByb3ZpZGVyADUHAIEGCCArIHNlY3JldACCLQYAHg0AZQ9hY2Nlc3NUb2tlbgBTEgCBMwoAFw8AgyULAIQMDHNvbHZlIHdpdGgARxEAhAoMQ2FyZAAVGg&s=roundgreen
   Put the following into websequencediagrams.com to regenerate:

    Card -> Consumer: request: authorize(params)
    Consumer -> Service: request: authorize(params)
    Service -> OauthController: startFlow
    OauthController -> OauthController: confirm via modal
    OauthController -> AuthWindow: pop-up
    AuthWindow -> OauthController: postMessage(authCode)
    OauthController -> Service: authCode
    Service --> <server>: POST exchangeUrl, authCode
    <server> --> OAuth Provider: POST authCode + secret
    OAuth Provider --> <server>: accessToken
    <server> --> Service: accessToken
    Service -> Consumer: resolve with accessToken
    Consumer -> Card: resolve with accessToken
*/

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
        var card = this.sandbox.card;
        var manifest = card.manifest;
        var clientId = cardEnv(card.id).oauthClientId;
        var paneDisplayName = (manifest && manifest.displayName || manifest.name);

        return this.authorize(params.authorizeUrl, clientId, redirectUri, paneDisplayName);
      }
    }
  },

  /*
    @public

    @method authorize
    @param  authorizeUrl {String}
  */
  authorize: function (authorizeUrl, clientId, redirectUri, paneDisplayName) {
    var oauthOptions = {
      authorizeUrl: authorizeUrl,
      clientId: clientId,
      redirectUri: redirectUri,
      paneDisplayName: paneDisplayName
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
