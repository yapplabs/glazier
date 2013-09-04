var SectionNavItemController = Ember.ObjectController.extend({
  isCurrent: function(){
    return true; //TODO: compare this to the current section
  }.property('content'),
  sectionIcon: function(){
    var containerType = this.get('containerType');
    switch(containerType) {
      case 'board':
        return 'icon-cards';
      default:
        return 'icon-star';
    }
  }.property('containerType')
});

export default SectionNavItemController;
