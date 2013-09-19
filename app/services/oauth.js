import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

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

var OauthService = Conductor.Oasis.Service.extend({
  oauthController: function() {
    return this.container.lookup('controller:oauth');
  },

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
        var clientId = manifest.env[Glazier.env].oauthClientId;
        var paneDisplayName = manifest.displayName || manifest.name;

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
    return this.oauthController().startOauthFlow(oauthOptions);
  },

  /*
    @public

    @method exchange
    @param  exchangeUrl {String}
    @param  authCode    {String}
  */
  exchange: function (exchangeUrl, authCode) {
    // return ajax promise for exchange authCode for accessToken
    return ajax(exchangeUrl, {
      type: 'post',
      dataType: 'text',
      data: {
        code: authCode
      }
    });
  }
});

export default OauthService;
