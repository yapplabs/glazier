var Conductor = requireModule('conductor');

function createServiceForTesting(ServiceClass, cardId) {
  var port = {
    on: function(prop, callback) {},
    onRequest: function(prop, callback) {}
  };
  var card = {
    id: cardId
  };
  var sandbox = {
    card: card
  };

  var service = new ServiceClass(port, sandbox);

  service.simulateRequest = function(requestName, key, value) {
    var promise = new Conductor.Oasis.RSVP.Promise(),
    handler = this.requests[requestName];

    if (!handler) {
      throw new Error("No such Request: `" + requestName + "`");
    }

    handler.call(this, promise, key, value);

    return promise;
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

export createServiceForTesting;
