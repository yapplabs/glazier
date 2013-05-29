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

function Proxy(registry, port, name) {
  this.registry = registry;
  this.port = port;
  this.name = name;
  this.loaded = false;
  this.targetPromise = new Conductor.Oasis.RSVP.Promise();
}

Proxy.prototype = {
  load: function () {
    if (this.loaded) return;
    console.log('Proxy.load target for '+this.name);
    var self = this;
    this.registry.resolveService(this.name).then(function (target) {
      console.log('Proxy target loaded for '+self.name);
      self.targetPromise.resolve(target);
    });
    this.loaded = true;
  },
  handle: function (eventName, data) {
    var self = this;
    console.log('Proxy handle '+ eventName);
    this.load(); //lazy load service
    this.targetPromise.then(function (target) {
      console.log('Proxy forwarding '+ eventName);
      var responseEvent = eventName.replace(/^@request:/, '@response:');
      var requestId = data.requestId;

      var observer = function(event) {
        if (event.requestId === requestId) {
          console.log('Proxy response '+ responseEvent);
          target.port.off(responseEvent, observer);
          this.port.send(responseEvent, event);
        }
      };

      target.port.on(responseEvent, observer, self);
      target.port.send(eventName, data);
    }, function (e) {
      console.error(e);
    });
  }
};

function CardRegistry(conductor) {
  this.conductor = conductor;
  var cardId, manifest;

  var ProxyService = Conductor.Oasis.Service.extend({
    registry: this,
    initialize: function (port, name) {
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
      } else {
        var proxy = new Proxy(this.registry, this.port, name);
        this.port.all(proxy.handle, proxy);
      }
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
    var promise = loaded[manifestUrl];
    if (!promise) {
      loaded[manifestUrl] = promise = new Conductor.Oasis.RSVP.Promise();
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
      card.sandbox.activatePromise.then(function () {
        promise.resolve(card);
      });

      var $cardWrapper = $("<div class='card-wrapper'>");

      $('.cards').append($cardWrapper);
      card.appendTo($cardWrapper[0]).then(function() {
        card.render();
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