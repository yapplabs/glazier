var IdentityService = Conductor.Oasis.Service.extend({
  events: {
    identified: function(userData) {
      var data = {
        github_access_token: userData.githubAccessToken
      };
      $.ajax({
        url: '/api/session.json',
        type: 'POST',
        data: data
      }).then(function(responseJson){
        console.log(responseJson);
      }, function(e){
        console.error(e);
      });
    }
  }
});

export IdentityService;
