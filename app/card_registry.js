import ProxyService from 'glazier/services/proxy';

function CardRegistry(conductor) {
  this.conductor = conductor;
  this.instances = {}; // track instances by id
}

CardRegistry.prototype = {
  // load(pane) -> card
  load: function (pane) {
    var id = pane.get('id');
    var instances = this.instances;
    var card = instances[id];
    if (card) return card;
    var conductorServices = this.conductor.services;
    var manifest = pane.get('type.manifest');
    var capabilities = [];
    var consumes = {};
    if (manifest.consumes) {
      manifest.consumes.forEach(function (capability) {
        if (!conductorServices[capability]) conductorServices[capability] = ProxyService;
        consumes[capability] = true;
        capabilities.push(capability);
      });
    }
    var provides = {};
    if (manifest.provides) {
      manifest.provides.forEach(function (capability) {
        if (!conductorServices[capability]) conductorServices[capability] = ProxyService;
        provides[capability] = true;
        capabilities.push(capability);
      });
    }
    card = this.conductor.load(manifest.jsUrl, id, {
      capabilities: capabilities
    });
    instances[id] = card;
    var targets = {};
    pane.get('capabilityProviders').forEach(function (capabilityProvider) {
      targets[capabilityProvider.get('capability')] = instances[capabilityProvider.get('provider.id')];
    });
    card.targets = targets;
    card.consumes = consumes;
    card.provides = provides;
    return card;
  },
  unload: function (pane) {
    // unload in the future should card.destroy
    delete this.instances[pane.get('id')];
  }
};

export CardRegistry;
