var OauthService = Conductor.Oasis.Service.extend({
  requests: {
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
      this.authorize(params.authorizeUrl).then(function (authCode) {
        return self.exchange(params.exchangeUrl, authCode);
      }).then(success, failure);
    }
  },

  authorize: function (authorizeUrl) {
    // show UI with button for popup window
    // return promise that resolves on popup window post message
  },

  exchange: function (exchangeUrl, authCode) {
    // return ajax promise for exchange authCode for accessToken
  }
});

export OauthService;
