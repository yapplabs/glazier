var ApplicationController = Ember.ArrayController.extend({
  needs: ['user'],
  repositoryName: null,
  user: Em.computed.oneWay('controllers.user.content'),
  loggedIn: Ember.computed.bool('user'),
  starredThisRepository: function(){
    var user = this.get('user');
    if (user) {
      var stargazers = this.get('content');
      return stargazers.some(function(stargazer, index){
        return stargazer.id === user.github_id;
      });
    } else {
      return false;
    }
  }.property('user', 'content')
});

export = ApplicationController;
