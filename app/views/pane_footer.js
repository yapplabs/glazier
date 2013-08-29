var PaneFooterView = Ember.View.extend({
  templateName: 'pane_footer',
  classNames: ['pane-footer'],
  target: Ember.computed.alias('parentView'),
  didBeginEditing: function() {

  },
  didFinishEditing: function(){

  }
});

export default PaneFooterView;
