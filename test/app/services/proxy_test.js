import ProxyService from 'glazier/services/proxy';

module('Glazier ProxyService');

test('test ProxyService for a provider', function () {
  var port = {};
  var card = {
    id: 'card-id'
  };
  var sandbox = {
    card:card
  };
  var capability = 'service name';
  var Service = ProxyService.extend({
    registry: {
      isProvider: function (cardId, service) {
        return true;
      }
    }
  });

  var service = new Service(port, sandbox);
  ok(service, 'created service');
  service.initialize(port, capability);
  equal(card.proxyTargets[capability], service, 'expected card to receive proxyTarget with service');
});

asyncTest('test ProxyService for a consumer', 9, function () {
  var requestEventName = '@request:someEvent';
  var requestEvent = {
    requestId: 'request id'
  };
  var responseEventName = '@response:someEvent';
  var responseEvent = {
    requestId: 'request id'
  };
  var srcPort = {
    all: function (callback, binding) {
      this._callback = callback;
      this._binding = binding;
    },
    send: function (name, event) {
      equal(name, responseEventName, 'proxy sends response back to src port');
      equal(event, responseEvent, 'proxy sends response back to src port');
      start();
    }
  };
  var targetPort = {
    on: function (eventName, callback, binding) {
      equal(eventName, responseEventName, 'proxy subscribed to responseEvent');
      this._callback = callback;
      this._binding = binding;
    },
    off: function () {},
    send: function (name, event) {
      equal(name, requestEventName, 'target got forwarded event');
      equal(event, requestEvent, 'target got forwarded event');
      setTimeout(function () {
        targetPort._callback.call(targetPort._binding, responseEvent);
      }, 0);
    }
  };

  var targetService = {
    port: targetPort
  };
  var card = {
    id: 'card-id'
  };
  var sandbox = {
    card:card
  };
  var capability = 'service name';
  var Service = ProxyService.extend({
    registry: {
      isProvider: function (cardId, service) {
        return false;
      },
      resolveService: function (serviceName) {
        equal(serviceName, capability, 'resolve target for service name');
        var promise = new Conductor.Oasis.RSVP.Promise();
        promise.resolve(targetService);
        return promise;
      }
    }
  });
  var service = new Service(srcPort, sandbox);

  ok(service, 'created service');

  service.initialize(srcPort, capability);

  equal(srcPort._callback, service.forward, 'service subscribed to port');
  equal(srcPort._binding, service, 'service subscribed to port');

  srcPort._callback.call(srcPort._binding, requestEventName, requestEvent);
});