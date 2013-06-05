
var IdentityService = Conductor.Oasis.Service.extend({
  updateName: function(name){

    // TODO: not this
    Ember.run(function() {
      Glazier.__container__.lookup("controller:application").set('name', name);
    });
  },
  events: {
    oauthIdentityEstablished: function(oauthData) {
      var service = this,
          data = {
            github_access_token: oauthData.accessToken
          };

      function broadcast(userJson) {
        service.updateName(userJson.user.github_login);
        service.port.send('identified', userJson);
      }

      $.ajax({
        url: '/api/session.json',
        type: 'POST',
        data: data
      }).then(broadcast).then(null,function(reason) {
        console.error(reason, reason.message, reason.stack);
        throw reason;
      });
    }
  }
});

export IdentityService;
