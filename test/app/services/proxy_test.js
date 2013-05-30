import ProxyService from 'glazier/services/proxy';
import {MockPort, MockChannel } from 'helpers/oasis_test_helpers';

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

asyncTest('test ProxyService for a consumer', 4, function () {
  var requestEventName = '@request:someEvent';
  var requestEvent = {
    requestId: 'request id'
  };
  var responseEventName = '@response:someEvent';
  var responseEvent = {
    requestId: 'request id'
  };

  var consumerCardPort = new MockPort('consumerCard');
  var proxyServicePort = new MockPort('proxyService');
  var proxyTargetPort  = new MockPort('proxyTarget');
  var providerCardPort = new MockPort('providerCard');

  var consumerChannel = new MockChannel('consumer', consumerCardPort, proxyServicePort);
  var providerChannel = new MockChannel('provider', proxyTargetPort, providerCardPort);

  var targetService = {
    port: proxyTargetPort
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

  var service = new Service(proxyServicePort, sandbox);

  ok(service, 'created service');

  service.initialize(proxyServicePort, capability);

  // card | srcPort <-> proxy <-> [targetPort | card]

  providerCardPort.on(requestEventName, function (e) {
    equal(e, requestEvent, 'provider card received request event');
    providerCardPort.send(responseEventName, responseEvent);
  });

  consumerCardPort.on(responseEventName, function (e) {
    equal(e, responseEvent, 'consumer card received response');
    start();
  });
  consumerCardPort.send(requestEventName, requestEvent);
});
