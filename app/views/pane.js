var PaneView = Ember.View.extend({
  templateName: 'pane',
  classNameBindings: [
    'controller.isHidden:hidden-pane:visible-pane',
    ':pane-wrapper',
    'fullSize'
  ],

  fullSize: false,

  expand: function(){
    var $pane = this.$();
    this.set('fullSize', true);
  },

  collapse: function(){
    var $pane = this.$();
    this.set('fullSize', false);
  },
});

export default PaneView;
