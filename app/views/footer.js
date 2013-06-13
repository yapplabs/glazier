var FooterView = Ember.View.extend({
  didInsertElement: function() {
    StarterKit.initializeAnalytics('#footer .analytics');
  }
});

export = FooterView;
