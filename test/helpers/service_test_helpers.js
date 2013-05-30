
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
    var promise = new Conductor.Oasis.RSVP.Promise();
    this.requests[requestName].apply(this, [promise, key, value]);
    return promise;
  };

  service.simulateSend = function(eventName, data) {
    this.events[eventName].apply(this, [eventName, data]);
  };

  return service;
}

export createServiceForTesting;
