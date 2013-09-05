var SectionNavigationStateManager = Ember.StateManager.extend({
  initialState: 'showing',
  showing: Ember.State.extend({
    edit: function(manager) {
      manager.transitionTo('editing');
    }
  }),
  editing: Ember.State.extend({
    done: function(manager) {
      manager.transitionTo('showing');
    },
    add: function(manager) {
      manager.router.send('showModal', 'add_section');
    },
    createSection: function(manager) {
      var addSectionController = this.container.lookup('controller:addSection');
      var dashboard = this.container.lookup('controller:dashboard').get('content');
      var name = addSectionController.get('name');
      dashboard.createSection({name: name, containerType: 'board'});
      manager.router.send('hideModal');
    },
    sectionNavigationController: function() {
      return this.container.lookup('controller:sectionNavigation');
    }.property(),
    enter: function() {
      this.get('sectionNavigationController').set('isEditing', true);
    },
    exit: function() {
      this.get('sectionNavigationController').set('isEditing', false);
    },
    edit: Ember.K
  })
});

export default SectionNavigationStateManager;
