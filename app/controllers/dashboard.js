var DashboardController = Ember.ObjectController.extend({
  needs: ['user'],
  user: Ember.computed.alias('controllers.user'),
  repositoryName: Ember.computed.alias('id'),
  isAdmin: function() {
    // var user = this.get('user.content'),
    //   repositoryName = this.get('repositoryName'),
    //   repos = user && user.editable_repositories;
    // return repos && repos.indexOf(repositoryName) !== -1;
    return true;
  }.property('user.content', 'repositoryName')
});
export default DashboardController;
