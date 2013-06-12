import 'glazier/card_manager' as CardManager;

var DashboardView = Ember.View.extend({
  init: function () {
    this._super();
    this.cardManager = this.container.lookup('cardManager:main');
  },

  didInsertElement: function () {
    var self = this;
    var cardManager = this.cardManager;

    this.get('controller.panes').forEach(function(pane) {

      pane.then(function() {
        var providers = pane.get('capabilityProviders');
        var type = pane.get('type');

        return Ember.RSVP.all([type, providers]).then(function () {
          var card = cardManager.load(pane);
          self.appendCard(card);
        }, function(reason) {
          console.error("error in DashboardView didInsertElement: ", reason);
        });
      });
    });
  },

  willDestroyElement: function() {
    this.get('controller.panes').forEach(function(pane) {
      this.cardManager.unload(pane);
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

export = DashboardView;
