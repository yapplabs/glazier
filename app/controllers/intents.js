var IntentsController = Ember.Controller.extend({
  needs: ['modalPaneType', 'paneTypes', 'dashboard'],

  actions: {
    handleIntent: function (intent) {
      var cardManager = this.get('controllers.dashboard.cardManager');
      if (intent.cardName) {
        this.handleExplicitIntent(intent, cardManager);
      } else {
        this.handleImplicitIntent(intent, cardManager);
      }
    }
  },

  handleExplicitIntent: function(intent, cardManager) {
    var controller = this;

    this.store.find('pane_type', intent.cardName).then(function(paneType) {
      if (!cardManager || cardManager.isDestroyed) {
        return Ember.RSVP.reject("card manager unavailable - no longer in dashboard route");
      }
      return cardManager.loadTransient(paneType, {intent: intent});
    }).then(function(card) {
      controller.showCardInModal(card);
    });
  },

  allPaneTypes: Ember.computed.alias('controllers.paneTypes.content'),

  handleImplicitIntent: function(intent, cardManager) {
    var self = this;
    this.get('allPaneTypes').then(function(allPaneTypes) {
      var paneTypes = allPaneTypes.filter(function(paneType) {
        var handlesIntents = paneType.get('manifest.handlesIntents');
        if (!Ember.isEmpty(handlesIntents)) {
          return handlesIntents.indexOf(intent.action) !== -1;
        }
      });

      if (paneTypes.length === 0) {
        return;
      }

      // TODO: what if more than one paneType handles the action?
      var card = cardManager.loadTransient(paneTypes[0], {intent: intent});
      self.showCardInModal(card);
    });
  },

  showCardInModal: function(card) {
    var modalPaneTypeController = this.get('controllers.modalPaneType');

    modalPaneTypeController.set('content', card);
    this.send('showModal', 'modal_pane_type');
  }
});

export default IntentsController;
