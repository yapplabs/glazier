var SectionNavigationController = Ember.ArrayController.extend({
  needs: ['dashboard', 'dashboardSection'],
  content: Ember.computed.alias('controllers.dashboard.sections'),
  itemController: 'sectionNavItem',
  stateManager: function() {
    return this.container.lookup('stateManager:sectionNavigation');
  }.property(),
  currentSection: Ember.computed.alias('controllers.dashboardSection.content')
});

export default SectionNavigationController;
