var PaneLoadingView = Ember.View.extend({
  templateName: 'pane_loading',
  classNameBindings: ['isLoaded', ':pane-loading'],

  isLoaded: Ember.computed.oneWay('controller.cardIsLoading'),

  updateVisibility: function() {
    var $el = this.$();
    if (!$el) { return; }

    if (this.get('isLoaded')) {
      // Fully hide the element in 500ms.
      Ember.run.later($el, 'hide', 500);

      // Alternatively:
      //$el.fadeOut();
    } 
  }.observes('isLoaded')
});

export default PaneLoadingView;


