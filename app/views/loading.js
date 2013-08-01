var LoadingView = Ember.View.extend({
  elementId: 'loading',
  templateName: 'loading',
  classNameBindings: 'isLoading',

  isLoading: Ember.computed.oneWay('controller.isLoading'),

  didInsertElement: function() {
    this.updateVisibility();
  },

  updateVisibility: function() {
    var $el = this.$();
    if (!$el) { return; }

    // Either we can immediately show the element or fade
    // in, depending on the CSS3 transitions to be applied.
    if (this.get('isLoading')) {

      $el.show();
      //$el.fadeIn();
    } else {
      // Fully hide the element in 1000ms.
      Ember.run.later($el, 'hide', 1000);
      //$el.fadeOut();
    }
  }.observes('isLoading')
});

export default LoadingView;

