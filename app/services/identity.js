import 'conductor' as Conductor;

var IdentityService = Conductor.Oasis.Service.extend({
  initialize: function(capabilty, port) {
    // unfortunately sandbox.destroy does not call a destroy method on the services
    // it doesn't even hold references to the service instances, so this leaks for now
    this.userController.addObserver('isLoggedIn', this, function () {
      this.port.send('currentUserChanged', this.userController.get('content'));
    });
  },

  /*
    @public

    @method updateName
    @param name {String}
  */
  updateName: function(name){
    var applicationController = this.container.lookup("controller:application");
    Ember.run(applicationController, 'set', 'name', name);
  },

  currentUser: function() {
    return this.userController.get('content');
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
  },
  requests: {
    currentUser: function (promise) {
      promise.resolve(this.currentUser());
    }
  }
});

export = IdentityService;
