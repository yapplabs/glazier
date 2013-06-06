import ProxyService from 'glazier/services/proxy';

var CardManager = Ember.Object.extend({
  init: function () {
    this.instances = {}; // track instances by id
  },

  // load(pane) -> card
  load: function (pane) {
    var id = pane.get('id');
    var card = this.instances[id];
    if (!card) {
      card = this._load(pane);
      this.instances[id] = card;
    }
    return card;
  },

  unload: function (pane) {
    // unload in the future should card.destroy
    delete this.instances[pane.get('id')];
  },

  _load: function (pane) {
    var manifest = pane.get('type.manifest');
    var capabilities = [];
    var consumes = this._processConsumes(manifest, capabilities);
    var provides = this._processProvides(manifest, capabilities);
    var card = this.conductor.load(manifest.jsUrl, pane.get('id'), {
      capabilities: capabilities
    });

    card.targets = this._getTargets(pane);
    card.consumes = consumes;
    card.provides = provides;
    return card;
  },

  _processConsumes: function (manifest, capabilities) {
    var conductorServices = this.conductor.services;
    var consumes = {};
    if (manifest.consumes) {
      manifest.consumes.forEach(function (capability) {
        if (!conductorServices[capability]) conductorServices[capability] = ProxyService;
        consumes[capability] = true;
        capabilities.push(capability);
      });
    }
    return consumes;
  },

  _processProvides: function (manifest, capabilities) {
    var conductorServices = this.conductor.services;
    var provides = {};
    if (manifest.provides) {
      manifest.provides.forEach(function (capability) {
        if (!conductorServices[capability]) conductorServices[capability] = ProxyService;
        provides[capability] = true;
        capabilities.push(capability);
      });
    }
    return provides;
  },

  _getTargets: function (pane) {
    var targets = {};
    var instances = this.instances;
    pane.get('capabilityProviders').forEach(function (capabilityProvider) {
      targets[capabilityProvider.get('capability')] = instances[capabilityProvider.get('provider.id')];
    });
    return targets;
  }
});

export CardManager;
