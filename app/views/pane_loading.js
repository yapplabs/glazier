var PaneLoadingView = Ember.View.extend({
  templateName: 'pane_loading',
  classNameBindings: ['isLoaded', ':pane-loading'],

  isLoaded: null, // binding provided in template

  updateVisibility: function() {
    var $el = this.$();
    if (!$el) { return; }

    if (this.get('isLoaded')) {
      $el.one('animationend webkitAnimationEnd oanimationEnd MSAnimationEnd', function() {
        $el.hide();
      });
    }
  }.observes('isLoaded')
});

export default PaneLoadingView;


