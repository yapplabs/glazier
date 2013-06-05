var DashboardView = Ember.View.extend({
  didInsertElement: function () {
    var cardRegistry = this.get('container').lookup('cardRegistry:main');
    cardRegistry.load('/cards/github-repositories/manifest.json');
  }
});

export DashboardView;
