var FooterView = Ember.View.extend({
  elementId: "footer",
  classNameBindings: ['controller.isDrawerOpen'],
  didInsertElement: function() {
    if( window.StarterKit ) StarterKit.insertAnalytics(this.$('.analytics .output')[0]);
  }
});

export default FooterView;
