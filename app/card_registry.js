/* global StarterKit */
var manifests = {
  '/cards/github-auth/manifest.json' : {
    jsUrl: '/cards/github-auth/card.js',
    consumes: [ 'fullXhr', 'configuration', 'userStorage', 'identity' ],
    provides: ['github:authenticated:read']
  },
  '/cards/github-repositories/manifest.json' : {
    jsUrl: '/cards/github-repositories/card.js',
    consumes: [ 'github:authenticated:read' ]
  }
};

var providers = {
  'github:authenticated:read' : '/cards/github-auth/manifest.json'
};

import ProxyService from 'glazier/services/proxy';

function CardRegistry(conductor) {
  this.conductor = conductor;
  var cardId, manifest;

  var Service = ProxyService.extend({
    registry: this
  });

  function registerService(name) {
    conductor.services[name] = Service;
  }

  for (cardId in manifests) {
    if (!manifests.hasOwnProperty(cardId)) continue;
    manifest = manifests[cardId];
    if (manifest.provides) {
      manifest.provides.forEach(registerService);
    }
  }
}

// tracks loading promises
var instances = {};
CardRegistry.prototype = {
  isProvider: function (cardId, serviceName) {
    var manifest = manifests[cardId];
    if (manifest.provides) {
      return manifest.provides.indexOf(serviceName) !== -1;
    }
    return false;
  },

  load: function (manifestUrl) {
    var card = instances[manifestUrl];
    if (card) return card;
    var manifest = manifests[manifestUrl];
    var options = {
      capabilities: []
    };
    if (manifest.consumes) {
      manifest.consumes.forEach(function (service) {
        options.capabilities.push(service);
      }, this);
    }
    if (manifest.provides) {
      manifest.provides.forEach(function (service) {
        options.capabilities.push(service);
      }, this);
    }
    return instances[manifestUrl] = this.conductor.load(manifest.jsUrl, manifestUrl, options);
  },
  // proxyService is ignored for now, assumes all cards get the same implementation
  // in the future the target can vary by proxyService
  getProxyTargetPort: function (proxyService, capability) {
    var manifestUrl = providers[capability]; // 1 to 1 for now
    var card = this.load(manifestUrl);
    return card.sandbox.activatePromise.then(function () {
      return card.sandbox.channels[capability].port1;
    });
  }
};

export CardRegistry;
