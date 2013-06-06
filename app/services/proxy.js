var ProxyService = Conductor.Oasis.Service.extend({
  capability: null,
  loaded: false,
  targetPromise: null,

  _requests: null,

  initialize: function (port, capability) {
    this.capability = capability;
    this._requests = {};

    if (this.sandbox.card.consumes[capability]) {
      this.targetPromise = new Conductor.Oasis.RSVP.Promise();
      port.all(this.forward, this);
    }
  },

  getProxyTargetPort: function () {
    var capability = this.capability;
    var targetCard = this.sandbox.card.targets[capability];
    return targetCard.sandbox.activatePromise.then(function () {
      return targetCard.sandbox.channels[capability].port1;
    });
  },

  load: function () {
    if (this.loaded) return;

    var self = this;

    this.getProxyTargetPort().then(function (targetPort) {
      targetPort.all(self.back, self);
      self.targetPort = targetPort;
      self.targetPromise.resolve(targetPort);
    }, console.error);

    this.loaded = true;
  },

  forward: function (eventName, data) {
    var self = this,
    requestId = data && data.requestId;

    if (requestId) {
      this._requests[requestId] = true;
    }

    this.load(); //lazy load service

    this.targetPromise.then(function (targetPort) {
      targetPort.send(eventName, data);
    }, console.error);
  },

  back: function (eventName, data) {
    var requestId = data && data.requestId;

    if (requestId) {
      if (this._requests[requestId]) {
        this.port.send(eventName, data);
        delete this._requests[requestId];
      }
    } else {
      this.port.send(eventName, data);
    }
  }
});

export ProxyService;
