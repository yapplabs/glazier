var SectionView = Ember.View.extend({
  elementId: 'section',
  classNames: ['block-group'],
  classNameBindings: [
    'controller.hidePanes'
  ]
});

export default SectionView;
