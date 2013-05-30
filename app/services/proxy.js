var ProxyService = Conductor.Oasis.Service.extend({
  initialize: function (port, name) {
    // this.sandbox.card.id
    // if name in consumes then this is the requester
    // if name in provides then this is the target
    // assert card can't provide and consume the same service
    this.name = name;
    this.loaded = false;
    this.targetPromise = null;
    var card = this.sandbox.card, cardId = card.id;
    if (this.registry.isProvider(cardId, name)) {
      if (!card.proxyTargets) {
        card.proxyTargets = {};
      }
      card.proxyTargets[name] = this;
    } else {
      this.targetPromise = new Conductor.Oasis.RSVP.Promise();
      port.all(this.forward, this);
    }
  },
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
  forward: function (eventName, data) {
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
});

export ProxyService;
