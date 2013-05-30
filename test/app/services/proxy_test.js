import ProxyService from 'glazier/services/proxy';

module('Glazier ProxyService');

test('test ProxyService for a provider', function () {
  var environmentPort = {};
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
  var service = new Service(environmentPort, sandbox);
  ok(service, 'created service');
  service.initialize(environmentPort, capability);
  equal(card.proxyTargets[capability], service, 'expected card to receive proxyTarget with service');
});
