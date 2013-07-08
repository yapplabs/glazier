import Conductor from 'conductor';

var ProxyService = Conductor.Oasis.Service.extend({
  /*
    @public

    @property capability
    @type String
    @default 'null'
  */
  capability: null,

  /*
    @public

    @property loaded
    @type Boolean
    @default 'false'
  */
  loaded: false,

  /*
    @public

    @property targetPromise
    @type Conductor.Oasis.RSVP.Promise.defer
    @default 'null'
  */
  targetPromise: null,

  /*
    @private

    @property _requests
    @type Object
    @default 'null'
  */
  _requests: null,

  initialize: function (port, capability) {
    this.capability = capability;
    this._requests = {};

    if (this.sandbox.card.consumes[capability]) {
      this.targetPromise = Conductor.Oasis.RSVP.defer();
      port.all(this.forward, this);
    }
  },

  /*
    @public

    @method getProxyTargetPort
  */
  getProxyTargetPort: function () {
    var capability = this.capability, providerPromise = this.sandbox.card.providerPromises[capability];

    if (!providerPromise) {
      throw new Error('No target card available to provide service ' + capability);
    }

    return providerPromise.then(function (targetCard) {
      return targetCard.sandbox.activatePromise.then(function () {
        return targetCard.sandbox.channels[capability].port1;
      });
    }, Conductor.error);
  },

  /*
    @public

    @method load
  */
  load: function () {
    if (this.loaded) return;

    var self = this;

    this.getProxyTargetPort().then(function (targetPort) {
      targetPort.all(self.back, self);
      self.targetPort = targetPort;
      self.targetPromise.resolve(targetPort);
    }, Conductor.error);

    this.loaded = true;
  },

  /*
    @public

    @method forward
    @param eventName {String}
    @param data {Object}
  */
  forward: function (eventName, data) {
    var self = this,
    requestId = data && data.requestId;

    if (requestId) {
      this._requests[requestId] = true;
    }

    this.load(); //lazy load service

    this.targetPromise.promise.then(function (targetPort) {
      targetPort.send(eventName, data);
    }, console.error);
  },

  /*
    @public

    @method back
    @param eventName {String}
    @param data {Object}
  */
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

export default ProxyService;
