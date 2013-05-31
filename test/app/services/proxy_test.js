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
});

asyncTest('test ProxyService for a consumer', 5, function () {
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

  var sandbox = {
    card: { id: 'card-id' }
  };

  var proxyCapability = 'service name';

  var Service = ProxyService.extend({
    registry: {
      isProvider: function (cardId, service) {
        return false;
      },
      getProxyTargetPort: function (service, capability) {
        equal(service, proxyService, 'resolve target for service name');
        equal(capability, proxyCapability, 'resolve target for service name');
        var promise = new Conductor.Oasis.RSVP.Promise();
        promise.resolve(proxyTargetPort);
        return promise;
      }
    }
  });

  var proxyService = new Service(proxyServicePort, sandbox);

  ok(proxyService, 'created service');

  proxyService.initialize(proxyServicePort, proxyCapability);

  // consumerCardPort-[consumerChannel]-proxyServicePort-[*Proxy Service*]-proxyTargetPort-[providerChannel]-providerCardPort

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
