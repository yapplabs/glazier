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
        });

      }).then(null, Conductor.error);
    });
  },

  willDestroyElement: function() {
    this.get('controller.panes').forEach(function(pane) {
      this.cardManager.unload(pane);
    }, this);
  },

  appendCard: function(card) {
    var $paneWrapper = Ember.$("<div class='pane-wrapper block'><div class='pane'>");
    this.$('.panes').append($paneWrapper);

    card.appendTo($paneWrapper.find('.pane')[0]).then(function() {
      card.render();
    }).then(null, Conductor.error);
  }
});

export = DashboardView;
