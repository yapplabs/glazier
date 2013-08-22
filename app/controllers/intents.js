var IntentsController = Ember.Controller.extend({
  needs: ['modalPaneType', 'paneTypes'],

  init: function() {
    this._super();
    // make sure they're loaded for the implicit intents filter
    this.get('allPaneTypes');
  },

  handleIntent: function (intent, cardManager) {
    if (intent.cardName) {
      this.handleExplicitIntent(intent, cardManager);
    } else {
      this.handleImplicitIntent(intent, cardManager);
    }
  },

  handleExplicitIntent: function(intent, cardManager) {
    var controller = this;

    Glazier.PaneType.find(intent.cardName).then(function(paneType) {
      if (!cardManager || cardManager.isDestroyed) {
        return Ember.RSVP.reject("card manager unavailable - no longer in dashboard route");
      }
      return cardManager.loadTransient(paneType, {intent: intent});
    }).then(function(card) {
      controller.showCardInModal(card);
    });
  },

  allPaneTypes: Ember.computed.alias('controllers.paneTypes'),

  handleImplicitIntent: function(intent, cardManager) {
    var paneTypes = this.get('allPaneTypes').filter(function(paneType) {
      var handlesIntents = paneType.get('manifest.handlesIntents');
      if (!Ember.isNone(handlesIntents)) {
        return handlesIntents.indexOf(intent.action) !== -1;
      }
    });

    if (paneTypes.length === 0) {
      return false;
    }

    // TODO: what if more than one paneType handles the action?
    var card = cardManager.loadTransient(paneTypes[0], {intent: intent});
    this.showCardInModal(card);
  },

  showCardInModal: function(card) {
    var modalPaneTypeController = this.get('controllers.modalPaneType');

    modalPaneTypeController.set('content', card);
    this.send('showModal', 'modal_pane_type');
  }
});

export default IntentsController;
