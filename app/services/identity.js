var IdentityService = Conductor.Oasis.Service.extend({

  /*
    @public

    @method updateName
    @param name {String}
  */
  updateName: function(name){
    var applicationController = this.container.lookup("controller:application");
    Ember.run(applicationController, 'set', 'name', name);
  },

  /*
    @public

    @property requests
    @type Object
  */
  events: {

    /*
      @public

      @method oauthIdentityEstablished
      @param oauthData {Object}
    */
    oauthIdentityEstablished: function(oauthData) {
      var service = this,
          data = {
            github_access_token: oauthData.accessToken
          };

      function broadcast(userJson) {
        service.updateName(userJson.github_login);
        service.port.send('identified', userJson);
      }

      $.ajax({
        url: '/api/session.json',
        type: 'POST',
        data: data
      }).then(broadcast).then(null, Conductor.error);
    }
  }
});

export = IdentityService;
