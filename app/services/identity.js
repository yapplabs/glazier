var IdentityService = Conductor.Oasis.Service.extend({
  events: {
    identified: function(userData) {
      var service = this,
          data = {
            github_access_token: userData.githubAccessToken
          };
      $.ajax({
        url: '/api/session.json',
        type: 'POST',
        data: data
      }).then(function(userJson){
        Glazier.__container__.lookup("controller:application").set('name', userJson.user.github_login)
        service.port.send('identified', userJson);
      }, function(e){
        console.error(e);
      });
    }
  }
});

export IdentityService;
