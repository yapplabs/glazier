var LoginService = Conductor.Oasis.Service.extend({

  /*
    @public

    @method updateName
    @param  name {String}
  */
  updateName: function(name){
    var applicationController = this.container.lookup("controller:application");
    Ember.run(function() {
      applicationController.set('name', name);
    });
  },

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
    loginWithGithub: function(promise, githubData) {
      var service = this,
          data = {
            github_access_token: githubData.accessToken
          };

      function resolve(userJson) {
        service.updateName(userJson.user.github_login);
        promise.resolve(userJson);
        // service.port.send('identified', userJson);
      }

      $.ajax({
        url: '/api/session.json',
        type: 'POST',
        data: data
      }).then(resolve).then(null,function(reason) {
        console.error(reason, reason.message, reason.stack);
        throw reason;
      });
    }
  }
});

export = LoginService;
