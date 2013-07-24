var DashboardController = Ember.ObjectController.extend({
  needs: ['user'],
  user: Ember.computed.alias('controllers.user'),
  repositoryName: Ember.computed.alias('id'),

  canAddPanes: function() {
    return this.get('isAdmin') && !this.get('addingPane');
  }.property('isAdmin', 'addingPane'),

  isAdmin: function() {
    var user = this.get('user.content'),
      repositoryName = this.get('repositoryName'),
      repos = user && user.editable_repositories;
    return repos && repos.indexOf(repositoryName) !== -1;
  },

  addablePanes: function() {
    return Glazier.PaneType.find();
  }.property(),

  addingPane: false,

  toggleAddingPanes: function() {
    this.toggleProperty('addingPane');
  }
});
export default DashboardController;
