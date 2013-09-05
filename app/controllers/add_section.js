var AddSectionController = Ember.Controller.extend({
  name: '',
  stateManager: function() {
    return this.container.lookup('stateManager:sectionNavigation');
  }.property()
});

export default AddSectionController;
