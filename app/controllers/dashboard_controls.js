var DashboardControlsController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  content: Ember.computed.alias('controllers.dashboard.content'),
  isAdmin: Ember.computed.alias('controllers.dashboard.isAdmin'),
  canAddPanes: Ember.computed.alias('isAdmin'),
  canReorderPanes: function(){
    return this.get('isAdmin') && (this.get('panes.length') > 1);
  }.property('isAdmin', 'panes.length')
});

export default DashboardControlsController;
