import PaneUserStorageService from 'glazier/services/pane_user_storage';
import assertResolved from 'helpers/promise_test_helpers';
import { inCard, TestService } from 'helpers/card_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';
import mockAjax from 'helpers/ajax_test_helpers';

import Conductor from 'conductor';

var conductor, card;

if (!/phantom/i.test(navigator.userAgent)) {
  module("Glazier PaneUserStorageService Integration", {
    setup: function() {
      conductor = new Conductor({
        testing: true,
        conductorURL: '/vendor/conductor.js.html'
      });
      Conductor.services['paneUserStorage'] = PaneUserStorageService;
      Conductor.services['test'] = TestService;

      card = conductor.load('/test/fixtures/app/services/pane_user_storage_card.js', 1, {
        capabilities: ['paneUserStorage', 'test']
      });
      card.promise.then(null, function(e){ console.log(e); });
      card.appendTo('#qunit-fixture');

      mockAjax();
    },
    teardown: function(){
      Ember.$.ajax.restore();
    }
  });

  asyncTest("A card can persist a key value pair via the service", 3, function() {
    inCard(card, function(card){
      var service = card.consumers.paneUserStorage;
      return service.request('setItem', 'foo', 'bar').then(function(){
        ok(true, 'setItem called');
      }, function(){
        ok(!true, 'service request setItem failed');
      });
    }).then(function(){
      var ajaxRequest = mockAjax.requests[0];
      ok(ajaxRequest, 'made an ajax request');
      equal(ajaxRequest && ajaxRequest.type, 'PUT', 'made a PUT request');
      start();
    }, function(reason){
      ok(false, reason);
      start();
    });
  });
}

// var port, card, sandbox;
module("Glazier PaneUserStorageService Unit", {
  setup: function() {
    this.service = createServiceForTesting(PaneUserStorageService, 'card-id');
    mockAjax();
  },
  teardown: function() {
    Ember.$.ajax.restore();
  }
});

asyncTest("setItem PUTs to /api/pane_user_entries/:card_id.json", 4, function() {
  this.service.simulateRequest('setItem', "name", "stef").then(function() {
    var ajaxRequest = mockAjax.requests[0];
    ok(ajaxRequest, 'made an ajax request');
    equal(ajaxRequest.type, 'PUT', 'made a PUT request');
    equal(ajaxRequest.url, '/api/pane_user_entries/card-id.json', 'made a request to the correct endpoint');
    var value = JSON.stringify('stef');
    deepEqual(ajaxRequest.data, { data: {name: value}, access: 'private' }, 'has expected payload ' + JSON.stringify(ajaxRequest.data) );
    start();
  }, function(e) {
    ok(false, "failed");
    start();
  });
});

asyncTest("removeItem DELETEs to /api/pane_user_entries/:card_id.json", 3, function() {
  this.service.simulateRequest('removeItem', "name").then(function() {
    var ajaxRequest = mockAjax.requests[0];
    equal(ajaxRequest.type, 'DELETE', 'made a DELETE request');
    equal(ajaxRequest.url, '/api/pane_user_entries/card-id.json', 'made a request to the correct endpoint');
    deepEqual(ajaxRequest.data, { key: 'name', access: 'private' }, 'has expected payload ' + JSON.stringify(ajaxRequest.data) );
    start();
  }, function() {
    ok(false, "failed");
    start();
  });
});
