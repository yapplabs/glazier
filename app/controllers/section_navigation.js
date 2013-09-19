var SectionNavigationController = Ember.ArrayController.extend({
  needs: ['dashboard', 'dashboard/section'],
  content: Ember.computed.alias('controllers.dashboard.sections'),
  itemController: 'sectionNavItem',
  stateManager: function() {
    return this.container.lookup('stateManager:sectionNavigation');
  }.property(),
  currentSection: Ember.computed.alias('controllers.dashboard/section.content'),
  sortProperties: ['position']
});

export default SectionNavigationController;
