import ConfigurationService from 'glazier/services/configuration';

var conductor, card;

module("Glazier ConfigurationService", {
  setup: function() {
    conductor = new Conductor({
      testing: true
    });
    Conductor.services['configuration'] = ConfigurationService;

    card = conductor.load('/test/fixtures/app/services/configuration_card.js', 1, {
      capabilities: ['configuration']
    });
    card.appendTo('#qunit-fixture');
  },
  teardown: function() {
  }
});

test("A card can return a configuration value by name", function() {
  expect(1);
  stop();
  $('<meta>').attr('name', 'config_test').attr('content', 'foo').appendTo('head');
  card.then(function() {
    return card.metadataFor('retrievedConfig');
  }).then(function(retrievedConfigValue) {
    start();
    equal(retrievedConfigValue, "foo");
  }).then(null, function(){
    start();
    ok(false, 'Card or configurationValue retrieval failed');
  });
});

