import 'glazier/services/configuration' as ConfigurationService;
import assertResolved from 'helpers/promise_test_helpers';

import 'conductor' as Conductor;

var conductor, card;

if (!/phantom/i.test(navigator.userAgent)) {
  module("Glazier ConfigurationService", {
    setup: function() {
      conductor = new Conductor({
        testing: true
      });
      Conductor.services['configuration'] = ConfigurationService;

      card = conductor.load('/test/fixtures/app/services/configuration_card.js', 1, {
        capabilities: ['configuration']
      });
      card.promise.then(null, function(e){ console.log(e); });
      card.appendTo('#qunit-fixture');
      $('<meta>').attr('name', 'config_test').attr('content', 'foo').appendTo('head');
    },
    teardown: function() {
      $('meta[name=config_test]').remove();
    }
  });

  asyncTest("A card can return a configuration value by name", 2, function() {
    assertResolved(card.promise.then(function() {
      return card.metadataFor('retrievedConfig');
    }).then(function(retrievedConfigValue) {
      start();
      equal(retrievedConfigValue, "foo");
    }));
  });
}
