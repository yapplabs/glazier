import 'conductor' as Conductor;

var OauthService = Conductor.Oasis.Service.extend({

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
      this.authorize(params.authorizeUrl).then(function (authCode) {
        return self.exchange(params.exchangeUrl, authCode);
      }).then(success, failure);
    }
  },

  /*
    @public

    @method loginWithGithub
    @param  authorizeUrl {String}
  */
  authorize: function (authorizeUrl) {
    // show UI with button for popup window
    // return promise that resolves on popup window post message
  },

  /*
    @public

    @method exchange
    @param  exchangeUrl {String}
    @param  authCode    {String}
  */
  exchange: function (exchangeUrl, authCode) {
    // return ajax promise for exchange authCode for accessToken
  }
});

export = OauthService;
