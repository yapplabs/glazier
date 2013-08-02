var DashboardController = Ember.ObjectController.extend({
  needs: ['user'],
  user: Ember.computed.alias('controllers.user'),
  repositoryName: Ember.computed.alias('id'),
  hidePanes: false,
  cardManager: null,

  contentDidChange: function() {
    Ember.run.once(this, this.setupCardManager);
  }.observes('content'),

  contentWillChange: function() {
    if (this.cardManager) {
      this.cardManager.destroy();
      this.cardManager = null;
    }
  }.observesBefore('content'),

  setupCardManager: function() {
    if (this.get('content')) {
      this.cardManager = this.container.lookup('cardManager:main');
    }
  },

  isAdmin: function() {
    var user = this.get('user.content'),
      repositoryName = this.get('repositoryName'),
      repos = user && user.editable_repositories;
    return repos && repos.indexOf(repositoryName) !== -1;
  }.property('user.content', 'repositoryName'),

  removePane: function(pane) {
    if (window.confirm('Are you sure you want to remove ' + pane.get('displayName') + '?')) {
      pane.get('dashboard.panes').removeObject(pane);
      pane.deleteRecord();
      pane.store.commit();
      this.cardManager.unload(pane);
    }
  }
});
export default DashboardController;
