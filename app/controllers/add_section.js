var AddSectionController = Ember.Controller.extend({
  name: '',
  stateManager: function() {
    return this.container.lookup('stateManager:sectionNavigation');
  }.property(),
  reset: function(){
    this.set('name', '');
  }
});

export default AddSectionController;
