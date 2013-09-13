var SectionNavigationStateManager = Ember.StateManager.extend({
  initialState: 'showing',
  showing: Ember.State.extend({
    edit: function(manager) {
      manager.transitionTo('editing');
    }
  }),
  editing: Ember.State.extend({
    done: function(manager) {
      this.persistUpdatedSectionNames(manager);
      manager.transitionTo('showing');
    },
    add: function(manager) {
      this.container.lookup('controller:addSection').reset();
      manager.router.send('showModal', 'add_section');
    },
    remove: function(manager, section) {
      if (window.confirm("Are you sure you want to remove '" + section.get('name') + "'?")) {
        var dashboard = this.container.lookup('controller:dashboard').get('content');
        var oldIndex = dashboard.get('sections').toArray().indexOf(section);
        dashboard.removeSection(section);
        section.one('didDelete', function(){
          manager.router.send('sectionRemoved', section, oldIndex);
        });
      }
    },
    createSection: function(manager) {
      var addSectionController = this.container.lookup('controller:addSection');
      var dashboard = this.container.lookup('controller:dashboard').get('content');
      var name = addSectionController.get('name');
      var section = dashboard.createSection({name: name, containerType: 'board'});
      section.one("didCreate", function(){
        manager.router.send('navigateToSection', section);
      });
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
    edit: Ember.K,
    persistUpdatedSectionNames: function(manager){
      this.container.lookup("controller:sectionNavigation").forEach(function(sectionNavItemController){
        if (sectionNavItemController.get('hasBufferedChanges')) {
          sectionNavItemController.applyBufferedChanges();
          sectionNavItemController.get('content').save()
        }
      });
    }
  })
});

export default SectionNavigationStateManager;
