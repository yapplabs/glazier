var SectionControlsController = Ember.ObjectController.extend({
  needs: ['dashboardSection'],
  content: Ember.computed.alias('controllers.dashboardSection.content'),
  isAdmin: Ember.computed.alias('controllers.dashboardSection.isAdmin'),
  canAddPanes: Ember.computed.alias('isAdmin'),
  canReorderPanes: function(){
    return this.get('isAdmin') && (this.get('panes.length') > 1);
  }.property('isAdmin', 'panes.length')
});

export default SectionControlsController;
