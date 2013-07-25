var CardDataManager = Ember.Object.extend({
  userController: null,
  repositoryController: null,
  repositoryName: Ember.computed.alias('repositoryController.path'),
  user: Ember.computed.alias('userController.content'),

  isAdmin: function() {
    var user = this.get('user'),
      repositoryName = this.get('repositoryName'),
      repos = user && user.editable_repositories;
    return repos && repos.indexOf(repositoryName) !== -1;
  }.property('user', 'repositoryName'),

  userData: function() {
    var user = this.get('user');
    if (!user) {return null;}

    return {
      name: user.name,
      github_login: user.github_login,
      github_id: user.github_id // TODO - camelize keys for cards?
    };
  }.property('user'),

  ambientData: function() {
    return {
      repositoryName: this.get('repositoryName'),
      user: this.get('userData'),
      isAdmin: this.get('isAdmin')
    };
  }.property('userData', 'repositoryName', 'isAdmin')
});

export default CardDataManager;
