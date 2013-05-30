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

  function MockPort() { }

  function logCall(fn, args) {
    fn.calledWith = fn.calledWith || [];
    fn.calledWith.push(Array.prototype.slice.call(arguments));
  }

  MockPort.prototype = {
    _events: { },
    _all: [ ],
    all: function all(callback, binding){
      logCall(all, arguments);

      this._all.push([callback, binding]);
    },

    on: function on(eventName, callback, binding) {
      logCall(on, arguments);

      this._events[eventName] = this._events[eventName] || [];
      this._events[eventName].push([callback, binding]);
    },

    off: function off(eventName) {
      logCall(off, arguments);

      delete this._events[eventName];
    },

    // this is sending to an iframe, e.g postMessage
    send: function send(name, event){
      logCall(send, arguments);
      this.port.trigger(name, event);
    },

    // this will be used from the test, to mimic
    // an iframe posting back
    //
    // e.g emitting message event
    trigger: function(name, event) {
      var port = this;

      function processEvents() {
        port._all.forEach(function(tuple) {
          var callback = tuple[0];
          var binding = tuple[1];

          callback.call(binding, name, event);
        });

        var tuples = port._events[name] || [];

        tuples.forEach(function(tuple) {
          var callback = tuple[0];
          var binding = tuple[1];

          callback.call(binding, event);
        });
      }

      setTimeout(processEvents, 0);
    }
  };

  function mockChannel(portA, portB) {
    this.portA = portA;
    this.portb = portb;

    portA.port = portB;
    portB.port = portA;
  }

  var srcPort = new MockPort();
  var targetPort = new MockPort();

  var channel = mockChannel(srcPort, targetPort);

  //srcPort.send = function (name, event) {
  //  equal(name, responseEventName, 'proxy sends response back to src port');
  //  equal(event, responseEvent, 'proxy sends response back to src port');
  //  start();
  //};

  //targetPort.on = function (eventName, callback, binding) {
  //    equal(eventName, responseEventName, 'proxy subscribed to responseEvent');
  //    this._callback = callback;
  //    this._binding = binding;
  //};

  //targetPort.send = function (name, event) {
  //    equal(name, requestEventName, 'target got forwarded event');
  //    equal(event, requestEvent, 'target got forwarded event');
  //    setTimeout(function () {
  //      targetPort._callback.call(targetPort._binding, responseEvent);
  //    }, 0);
  //  }
  //};

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

  // card | srcPort <-> proxy <-> [targetPort | card]

  equal(srcPort._callback, service.forward, 'service subscribed to port');
  equal(srcPort._binding, service, 'service subscribed to port');

  // simulate the message event fromthe source ports message channel
  srcPort.trigger(requestEventName, requestEvent);
});
