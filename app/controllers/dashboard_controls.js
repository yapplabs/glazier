var DashboardControlsController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  content: Ember.computed.alias('controllers.dashboard.content'),
  isAdmin: Ember.computed.alias('controllers.dashboard.isAdmin'),
  canAddPanes: function() {
    return this.get('isAdmin') && !this.get('addingPane');
  }.property('isAdmin', 'addingPane')
});

export default DashboardControlsController;
