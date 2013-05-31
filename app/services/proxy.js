var ProxyService = Conductor.Oasis.Service.extend({
  name: null,
  loaded: false,
  targetPromise: null,
  initialize: function (port, name) {
    this.name = name;
    var card = this.sandbox.card, cardId = card.id;
    if (!this.registry.isProvider(cardId, name)) {
      this.targetPromise = new Conductor.Oasis.RSVP.Promise();
      port.all(this.forward, this);
    }
  },
  load: function () {
    if (this.loaded) return;
    console.log('Proxy.load target for '+this.name);
    var self = this;
    this.registry.getProxyTargetPort(this, this.name).then(function (targetPort) {
      console.log('Proxy target loaded for '+self.name);
      targetPort.all(self.back, self);
      self.targetPort = targetPort;
      self.targetPromise.resolve(targetPort);
    });
    this.loaded = true;
  },
  forward: function (eventName, data) {
    var self = this;
    console.log('Proxy handle '+ eventName);
    this.load(); //lazy load service
    this.targetPromise.then(function (targetPort) {
      targetPort.send(eventName, data);
    }, function (e) {
      console.error(e);
    });
  },
  back: function (eventName, data) {
    this.port.send(eventName, data);
  }
});

export ProxyService;
