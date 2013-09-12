var SectionControlsController = Ember.ObjectController.extend({
  needs: ['dashboard/section'],
  content: Ember.computed.alias('controllers.dashboard/section.content'),
  isAdmin: Ember.computed.alias('controllers.dashboard/section.isAdmin'),
  canAddPanes: Ember.computed.alias('isAdmin'),
  canReorderPanes: function(){
    return this.get('isAdmin') && (this.get('panes.length') > 1);
  }.property('isAdmin', 'panes.length')
});

export default SectionControlsController;
