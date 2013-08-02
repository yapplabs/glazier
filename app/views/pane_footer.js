var PaneFooterView = Ember.View.extend({
  templateName: 'pane_footer',
  classNames: ['pane-footer'],

  didBeginEditing: function() {

  },

  didFinishEditing: function(){

  },

  toggleExpansion: function() {
    this.get('parentView').toggleExpansion();
  }
});

export default PaneFooterView;
