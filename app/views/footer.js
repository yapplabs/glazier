var FooterView = Ember.View.extend({
  elementId: "footer",
  classNameBindings: ['controller.isDrawerOpen'],
  didInsertElement: function() {
    StarterKit.initializeAnalytics(this.$('.analytics'));
  }
});

export default FooterView;
