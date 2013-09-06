import BufferedProxyMixin from 'glazier/controllers/buffered_proxy_mixin';

var SectionNavItemController = Ember.ObjectController.extend(BufferedProxyMixin, {
  isCurrent: function(){
    return this.get('content') === this.get('parentController.currentSection');
  }.property('content', 'parentController.currentSection'),
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
