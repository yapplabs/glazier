var Conductor = requireModule('conductor');

function createServiceForTesting(ServiceClass, cardId, manifest) {
  var port = {
    on: function(prop, callback) {},
    onRequest: function(prop, callback) {}
  };
  var card = {
    id: cardId,
    manifest: manifest || {}
  };
  var sandbox = {
    card: card
  };

  var service = new ServiceClass(port, sandbox);
  if (service.initialize) {
    service.initialize(port, sandbox);
  }

  service.simulateRequest = function(requestName, key, value) {
    var handler = this.requests[requestName],
    thisArg = this;

    if (!handler) {
      throw new Error("No such Request: `" + requestName + "`");
    }

    return new Conductor.Oasis.RSVP.Promise(function(resolve, reject){
      resolve(handler.call(thisArg, key, value));
    });
  };

  service.simulateSend = function(eventName, data) {
    var handler = this.events[eventName];

    if (!handler) {
      throw new Error("No such Event: `" + eventName + "`");
    }

    handler.call(this, data);
  };

  return service;
}

export default createServiceForTesting;
