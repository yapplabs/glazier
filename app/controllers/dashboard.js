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

  paneTypes: function() {
    return Glazier.PaneType.find();
  }.property(),

  addablePaneTypes: function() {
    var paneTypes = this.get('paneTypes');
    var myPaneTypes = this.get('panes').mapProperty('paneType');

    return paneTypes.filter(function(paneType) {
      return !myPaneTypes.contains(paneType);
    });
  }.property('paneTypes.[]', 'panes.@each.paneType'),

  addingPane: false,

  toggleAddingPanes: function() {
    this.toggleProperty('addingPane');
  },

  addPane: function(paneType) {
    var record = Glazier.Pane.createRecord({
      dashboard: this.get('content'),
      paneType: paneType
    });

    record.store.commit();
  }
});
export default DashboardController;
