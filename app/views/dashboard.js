import CardRegistry from 'glazier/card_registry';

var DashboardView = Ember.View.extend({
  didInsertElement: function () {
    var self = this;
    var conductor = this.container.lookup('conductor:main');
    var cardRegistry = this.container.lookup('cardRegistry:main');
    this.get('controller.cards').forEach(function(card) {
      card.then(function() {
        cardRegistry.load(card.get('cardType.id')).then(function(conductorCard) {
          self.appendConductorCard(conductorCard);
        });
      });
    });
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
