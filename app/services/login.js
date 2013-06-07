var LoginService = Conductor.Oasis.Service.extend({
  updateName: function(name){
    var applicationController = this.container.lookup("controller:application");
    Ember.run(function() {
      applicationController.set('name', name);
    });
  },
  requests: {
    loginWithGithub: function(promise, githubData) {
      var service = this,
          data = {
            github_access_token: githubData.accessToken
          };

      function resolve(userJson) {
        service.updateName(userJson.user.github_login);
        promise.resolve(userJson)
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

export LoginService;
