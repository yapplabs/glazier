var ApplicationController = Ember.Controller.extend({
  githubAccessToken: null,
  githubAccessTokenDidChange: function() {
    var token = this.get('githubAccessToken');
    Ember.$.ajax({
      url: 'https://api.github.com/user?access_token=' + token,
      type: 'GET',
      dataType: 'json',
      context: this
    }).then(function(data) {
      Ember.Logger.debug(data);
      this.set('name', data.name);
    });
  }.observes('githubAccessToken')
});

export ApplicationController;
