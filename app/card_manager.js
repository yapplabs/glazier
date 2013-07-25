import ProxyService from 'glazier/services/proxy';
import Conductor from 'conductor';

/*
  @class CardManager
  @extends Ember.Object
*/
var CardManager = Ember.Object.extend({
  cardDataManager: null,

  init: function () {
    this.instances = {}; // track instances by id
    this.providerCardDeferreds = {};
    this.proxiedCapabilities = {};
  },

  userDataDidChange: function() {
    Ember.run.once(this, function() {
      var userData = this.get('cardDataManager.userData');
      this._updateUserData(userData);
      this._updateUserRelatedPanesData();
    });
  }.observes('cardDataManager.userData', 'cardDataManager.isAdmin'),

  /*
    @public

    @method load
    @param pane {Glazier.Pane}
    @return {Conductor.Card} the panes card
  */
  load: function (pane) {
    var id = pane.get('id');
    var card = this.instances[id];
    if (!card) {
      card = this._load(pane);
      this.instances[id] = card;
    }
    return card;
  },

  /*
    @public

    Unloads the provided pane

    @method unload
    @param pane {Glazier.Pane}
  */
  unload: function (pane) {
    var cardId = pane.get('id'),
        card = this.instances[cardId],
        provides = card && card.provides,
        key;
    if (!card) return;

    for (key in provides) {
      if (provides.hasOwnProperty(key)) {
        delete this.providerCardDeferreds[key];
      }
    }

    card.destroy();

    delete this.instances[cardId];
  },

  _updateUserRelatedPanesData: function() {
    var paneIds = Glazier.Pane.all().mapProperty('id');
    var cardManager = this;

    if (paneIds.length === 0) { return; }

    Glazier.Pane.query({ids: paneIds}).then(function(panes) {
      panes.forEach(function(pane) {
        var card = cardManager.instances[pane.get('id')];
        if (card) {
          card.updateData('paneUserDataEntries', pane.get('paneUserDataEntries'));
          card.updateData('paneTypeUserDataEntries', pane.get('paneTypeUserDataEntries'));
        }
      });
    });
  },

  _updateUserData: function (userData) {
    this._getCards().forEach(function(card) {
      card.updateData('user', userData);
      card.updateData('isAdmin', this.get('cardDataManager.isAdmin'));
    }, this);
  },

  _getCards: function () {
    var card, cards = [];
    Ember.keys(this.instances).forEach(function(paneId) {
      card = this.instances[paneId];
      cards.push(card);
    }, this);
    return cards;
  },

  /*
    @private

    @method _load
    @param pane {Glazier.Pane}
    @return {Conductor.Card} the panes card
  */
  _load: function (pane) {
    var capabilities = [],
        manifest = pane.get('paneType.manifest'),
        paneId = pane.get('id'),
        dashboardId = pane.get('dashboard.id'),
        cardData = this._cardData(pane, manifest),
        cardUrl = manifest.cardUrl,
        providerCardDeferreds = this.providerCardDeferreds,
        consumes,
        provides,
        ambientData,
        data;

    if (!cardUrl) {
      throw new Error("cardUrl cannot be null or undefined");
    }

    consumes = this._processConsumes(manifest, capabilities);
    provides = this._processProvides(manifest, capabilities);

    ambientData = this.cardDataManager.get('ambientData');

    data = Ember.$.extend({}, ambientData, cardData);
    this.conductor.loadData(cardUrl, paneId, data);

    var card = this.conductor.load(cardUrl, paneId, {
      capabilities: capabilities
    });

    // attach wiretapping for the analytics panel
    if (window.StarterKit) window.StarterKit.wiretapCard(card);

    card.providerPromises = {};
    for (var capability in providerCardDeferreds) {
      if (!providerCardDeferreds.hasOwnProperty(capability)) continue;
      var deferred = providerCardDeferreds[capability];
      if (consumes[capability]) {
        card.providerPromises[capability] = deferred.promise;
      } else if (provides[capability]) {
        deferred.resolve(card);
      }
    }
    card.consumes = consumes;
    card.provides = provides;
    card.hidden = (manifest.ui === false);
    card.manifest = manifest;
    return card;
  },

  _cardData: function(pane, manifest) {
    var env = (/glazier\.herokuapp\.com/.test(window.location.hostname)) ? 'prod' : 'dev',
        paneData = pane.get('cardData');
    manifest.env = manifest.env || {};
    return Ember.merge({ env: manifest.env[env] }, paneData);
  },

  /*
    @private

    @method _processConsumes
    @param  manifest {Object
    @param  capabilities {Object}
    @return {Object}
  */
  _processConsumes: function (manifest, capabilities) {
    var conductorServices = this.conductor.services,
        providerCardDeferreds = this.providerCardDeferreds,
        consumes = {};
    if (manifest.consumes) {
      manifest.consumes.forEach(function (capability) {
        if (!conductorServices[capability]) {
          conductorServices[capability] = ProxyService;
          if (!providerCardDeferreds[capability]) {
            providerCardDeferreds[capability] = Conductor.Oasis.RSVP.defer();
          }
        }
        consumes[capability] = true;
        capabilities.push(capability);
      });
    }
    return consumes;
  },

  /*
    @public

    @method load
    @return {Conductor.Card} the panes card
  */
  _processProvides: function (manifest, capabilities) {
    var conductorServices = this.conductor.services,
        providerCardDeferreds = this.providerCardDeferreds,
        proxiedCapabilities = this.proxiedCapabilities,
        provides = {};
    if (manifest.provides) {
      manifest.provides.forEach(function (capability) {
        if (!conductorServices[capability]) {
          conductorServices[capability] = ProxyService;
          proxiedCapabilities[capability] = true;
        }
        if (proxiedCapabilities[capability]) {
          providerCardDeferreds[capability] = Conductor.Oasis.RSVP.defer();
        }
        provides[capability] = true;
        capabilities.push(capability);
      });
    }
    return provides;
  }
});

export default CardManager;
