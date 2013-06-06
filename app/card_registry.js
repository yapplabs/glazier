import ProxyService from 'glazier/services/proxy';

function CardRegistry(conductor) {
  this.conductor = conductor;
}

// track instances by id
var instances = {};
CardRegistry.prototype = {
  // load(cardModel) -> card
  load: function (cardModel) {
    var id = cardModel.get('id');
    var card = instances[id];
    if (card) return card;
    var conductorServices = this.conductor.services;
    var manifest = cardModel.get('type.manifest');
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
    cardModel.get('capabilityProviders').forEach(function (capabilityProvider) {
      targets[capabilityProvider.get('capability')] = instances[capabilityProvider.get('provider.id')];
    });
    card.targets = targets;
    card.consumes = consumes;
    card.provides = provides;
    return card;
  },
  unload: function (cardModel) {
    // unload in the future should card.destroy
    delete instances[cardModel.get('id')];
  }
};

export CardRegistry;
