/* global StarterKit */
var manifests = {
  '/cards/github-auth/manifest.json' : {
    jsUrl: '/cards/github-auth/card.js',
    consumes: [ 'fullXhr', 'configuration' ],
    provides: ['github:authenticated:read']
  },
  '/cards/github-repositories/manifest.json' : {
    jsUrl: '/cards/github-repositories/card.js',
    consumes: [ 'github:authenticated:read' ]
  }
};

var services = {
  'github:authenticated:read' : '/cards/github-auth/manifest.json'
};

// tracks loaded cards
var loaded = {};

function Proxy(registry, name) {
  this.registry = registry;
  this.name = name;
  this.target = null;
  this.targetPromise = null;
  this.queue = [];
}

Proxy.prototype = {
  handle: function (type, data) {
    if (!this.target) {
      this.queue.push([type, data]);
      if (!this.targetPromise) {
        var self = this;
        this.targetPromise = this.registry.resolveService(this.name).then(function (target) {
          self.target = target;
          self.flush();
        });
      }
    }
  },
  flush: function () {
    this.queue.forEach(function (pair) {
      var event = pair[0];
      var data = pair[1];
      this.target.send(event, data);
    }, this);
  }
};

function Target(name) {
  this.name = name;
}

Target.prototype = {
  handle: function (type, data) {
    console.log(type, data);
  }
};

function CardRegistry(conductor) {
  this.conductor = conductor;
  var cardId, manifest;

  var ProxyService = Conductor.Oasis.Service.extend({
    registry: this,
    initialize: function (oasisObject, name) {
      // this.sandbox.card.id
      // if name in consumes then this is the requester
      // if name in provides then this is the target
      // assert card can't provide and consume the same service
      var card = this.sandbox.card, cardId = card.id;
      var manifest = manifests[cardId];
      if (manifest.provides && manifest.provides.indexOf(name) !== -1) {
        if (!card.proxyTargets) {
          card.proxyTargets = {};
        }
        card.proxyTargets[name] = this;
        this.handler = new Target(name);
      } else {
        this.handler = new Proxy(this.registry, name);
      }
      this.port.all(this.handler.handle, this.handler);
    }
  });

  function registerService(name) {
    conductor.services[name] = ProxyService;
  }

  for (cardId in manifests) {
    if (!manifests.hasOwnProperty(cardId)) continue;
    manifest = manifests[cardId];
    if (manifest.provides) {
      manifest.provides.forEach(registerService);
    }
  }
}

CardRegistry.prototype = {
  load: function (manifestUrl) {
    var promise = new Conductor.Oasis.RSVP.Promise();
    if (loaded[manifestUrl]) {
      promise.resolve(loaded[manifestUrl]);
    } else {
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
      var card = this.conductor.load(manifest.jsUrl, manifestUrl, options);
      card.promise.then(function (card) {
        loaded[manifestUrl] = card;
        promise.resolve(card);
      });

      StarterKit.wiretapCard(card);
    }
    return promise;
  },

  resolveService: function (serviceName) {
    var cardId = services[serviceName]; // 1 to 1 for now
    return this.load(cardId).then(function (card) {
      return card.proxyTargets[serviceName];
    });
  }
};

export CardRegistry;