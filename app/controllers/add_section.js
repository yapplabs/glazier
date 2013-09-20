var AddSectionController = Ember.Controller.extend({
  name: '',
  containerType: 'board',
  containerTypes: [
    {
      label: 'Board',
      value: 'board'
    },
    {
      label: 'Page',
      value: 'page'
    }
  ],
  stateManager: function() {
    return this.container.lookup('stateManager:sectionNavigation');
  }.property(),
  reset: function(){
    this.set('name', '');
  }
});

export default AddSectionController;
