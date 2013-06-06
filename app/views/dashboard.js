import CardRegistry from 'glazier/card_registry';

var DashboardView = Ember.View.extend({
  init: function () {
    this._super();
    this.cardRegistry = this.container.lookup('cardRegistry:main');
  },
  didInsertElement: function () {
    var self = this;
    var cardRegistry = this.cardRegistry;
    this.get('controller.panes').forEach(function(pane) {
      pane.then(function() {
        Ember.RSVP.all([pane.get('type'), pane.get('capabilityProviders')]).then(function () {
          var card = cardRegistry.load(pane);
          self.appendCard(card);
        });
      });
    });
  },
  willDestroyElement: function() {
    this.get('controller.panes').forEach(function(pane) {
      this.cardRegistry.unload(pane);
    }, this);
  },
  appendCard: function(card) {
    var $cardWrapper = Ember.$("<div class='card-wrapper'>");
    this.$('.cards').append($cardWrapper);

    card.appendTo($cardWrapper[0]).then(function() {
      card.render();
    });
  }
});

export DashboardView;
