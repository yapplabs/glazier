var DashboardController = Ember.ObjectController.extend({
  needs: ['user'],
  user: Ember.computed.alias('controllers.user'),
  repositoryName: Ember.computed.alias('id'),
  hidePanes: false,

  isAdmin: function() {
    var user = this.get('user.content'),
      repositoryName = this.get('repositoryName'),
      repos = user && user.editable_repositories;
    return repos && repos.indexOf(repositoryName) !== -1;
  }.property('user.content', 'repositoryName'),

  removePane: function(pane) {
    if (window.confirm('Are you sure you want to remove ' + pane.get('displayName') + '?')) {
      pane.deleteRecord();
      pane.store.commit();
    }
  }
});
export default DashboardController;
