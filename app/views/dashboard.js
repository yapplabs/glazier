import CardRegistry from 'glazier/card_registry';

var DashboardView = Ember.View.extend({
  init: function () {
    this._super();
    this.cardRegistry = this.container.lookup('cardRegistry:main');
  },
  didInsertElement: function () {
    var self = this;
    var cardRegistry = this.cardRegistry;
    this.get('controller.cards').forEach(function(card) {
      card.then(function() {
        Ember.RSVP.all([card.get('type'), card.get('capabilityProviders')]).then(function () {
          var conductorCard = cardRegistry.load(card);
          self.appendConductorCard(conductorCard);
        });
      });
    });
  },
  willDestroyElement: function() {
    this.get('controller.cards').forEach(function(card) {
      this.cardRegistry.unload(card);
    }, this);
  },
  appendConductorCard: function(conductorCard) {
    var $cardWrapper = Ember.$("<div class='card-wrapper'>");
    this.$('.cards').append($cardWrapper);

    conductorCard.appendTo($cardWrapper[0]).then(function() {
      conductorCard.render();
    });
  }
});

export DashboardView;
