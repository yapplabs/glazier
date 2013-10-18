import ProxyService from 'glazier/services/proxy';
import Conductor from 'conductor';

/*
  @class CardManager
  @extends Ember.Object
*/
var CardManager = Ember.Object.extend({
  cardDataManager: null,
  // This is set to an object that has a 'providedCapabilities' property
  providerCardCatalog: null,

  init: function () {
    this.instances = {}; // track instances by id
    this.providerCardDeferreds = {};
    this.proxiedCapabilities = {};
  },

  userDataDidChange: function() {
    Ember.run.once(this, this._updateUserDataHelper);
  }.observes('cardDataManager.userData', 'cardDataManager.isAdmin'),

  _updateUserDataHelper: function() {
    var userData = this.get('cardDataManager.userData');
    this._updateUserData(userData);
    this._updateUserRelatedPanesData();
  },

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
      card = this._loadFromPane(pane);
      this.instances[id] = card;
    }
    return card;
  },

  loadTransient: function(paneType, cardData) {
    var id = "transient_" + Ember.generateGuid(); // unique id so it cannot be in the cache
    cardData = this._cardData(null, paneType.get('manifest'), cardData);
    var card = this._load(paneType, id, cardData);
    this.instances[id] = card;
    return card;
  },

  unload: function (pane) {
    var key,
      id = pane.get('id'),
      card = this.instances[id],
      provides = card && card.provides;

    delete this.instances[id];

    for (key in provides) {
      if (provides.hasOwnProperty(key)) {
        delete this.providerCardDeferreds[key];
      }
    }
  },

  setProviderCardCatalog: function(providerCardCatalog) {
    this.set('providerCardCatalog', providerCardCatalog);
  },

  _updateUserRelatedPanesData: function() {
    var paneIds = Ember.keys(this.instances);
    var cardManager = this;

    if (paneIds.length === 0) { return; }

    this.store.find('pane', {ids: paneIds}).then(function(panes) {
      panes.toArray().sort(Glazier.Pane.sortPanesThatProvideServicesFirst).forEach(function(pane) {
        var card = cardManager.instances[pane.get('id')];
        if (card) {
          card.updateData('paneUserEntries', pane.get('paneUserEntries'));
          card.updateData('paneTypeUserEntries', pane.get('paneTypeUserEntries'));
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

    @method _loadFromPane
    @param pane {Glazier.Pane}
    @return {Conductor.Card} the panes card
  */
  _loadFromPane: function (pane) {
    var manifest = pane.get('paneType.manifest'),
        paneId = pane.get('id'),
        cardData = this._cardData(pane, manifest),
        paneType = pane.get('paneType');

    return this._load(paneType, paneId, cardData);
  },

  _load: function(paneType, paneId, cardData) {
    var capabilities = [],
        manifest = paneType.get('manifest'),
        cardUrl = manifest.cardUrl,
        providerCardDeferreds = this.providerCardDeferreds,
        servicesMap = Ember.$.extend({}, this.conductor.services),
        consumes,
        provides,
        ambientData,
        data;

    if (!cardUrl) {
      throw new Error("cardUrl cannot be null or undefined");
    }

    consumes = this._processConsumes(manifest, capabilities, servicesMap);
    provides = this._processProvides(manifest, capabilities, servicesMap);

    ambientData = this.cardDataManager.get('ambientData');

    data = Ember.$.extend({}, ambientData, cardData);
    this.conductor.loadData(cardUrl, paneId, data);

    var card = this.conductor.load(cardUrl, paneId, {
      capabilities: capabilities,
      services: servicesMap
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

  _cardData: function(pane, manifest, data) {
    var paneData = {};

    manifest.env = manifest.env || {};

    if (pane) {
      paneData = pane.get('cardData');
    }

    var defaults = {
      repositoryName: this.get('cardDataManager.repositoryName'),
      env: manifest.env[Glazier.env]
    };

    return Ember.merge(defaults, Ember.merge(paneData, data || {}));
  },

  /*
    @private

    @method _processConsumes
    @param  manifest {Object
    @param  capabilities {Object}
    @return {Object}
  */
  _processConsumes: function (manifest, capabilities, serviceMap) {
    var conductorServices = this.conductor.services,
        providerCardDeferreds = this.providerCardDeferreds,
        additionalProvidedCapabilities = this.get('providerCardCatalog.providedCapabilities'),
        consumes = {};

    if (manifest.consumes) {
      manifest.consumes.forEach(function (capability) {
        if (!conductorServices[capability]) {
          if (additionalProvidedCapabilities.indexOf(capability) === -1) {
            console.assert(false, "requested a service that nothing provides: " + capability);
          }
          serviceMap[capability] = ProxyService;
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
  _processProvides: function (manifest, capabilities, serviceMap) {
    var conductorServices = this.conductor.services,
        providerCardDeferreds = this.providerCardDeferreds,
        provides = {};

    if (manifest.provides) {
      manifest.provides.forEach(function (capability) {
        if (!conductorServices[capability]) {
          serviceMap[capability] = Conductor.Oasis.Service;
          if (!providerCardDeferreds[capability]) {
            providerCardDeferreds[capability] = Conductor.Oasis.RSVP.defer();
          }
        }
        provides[capability] = true;
        capabilities.push(capability);
      });
    }
    return provides;
  }
});

export default CardManager;
