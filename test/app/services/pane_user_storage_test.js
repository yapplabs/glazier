import PaneUserStorageService from 'glazier/services/pane_user_storage';
import assertResolved from 'helpers/promise_test_helpers';
import { inCard, TestService } from 'helpers/card_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';
import mockAjax from 'helpers/ajax_test_helpers';
import Conductor from 'conductor';
import isolatedContainer from 'helpers/container_test_helpers';

var conductor, card;

function pushPane(store, cardId){
  store.push('pane_type', {
    id: 'glazier-stackoverflow-auth',
    manifest: {
      cardUrl: '/cards/glazier-stackoverflow-auth/card.js',
      consumes: ['fullXhr'],
      provides: ['authenticatedStackoverflowApi']
    }
  });

  store.push('pane', {
    id: cardId,
    paneUserEntries: {},
    paneEntries: {},
    dashboard_id: 'emberjs/ember.js',
    pane_type_id: 'glazier-stackoverflow-auth'
  });
}

if (!/phantom/i.test(navigator.userAgent)) {
  module("Glazier PaneUserStorageService Integration", {
    setup: function() {
      var container = isolatedContainer(
        [
        'service:pane_user_storage',
        'model:pane_type',
        'model:pane',
        'model:section'
        ]);
      container.register('store:main', DS.Store.extend({
        adapter: DS.FixtureAdapter
      }));
      container.register('service:test', { create: function(){ return TestService; }});

      conductor = new Conductor({
        container: container,
        testing: true,
        conductorURL: '/vendor/conductor.js.html'
      });

      conductor.services['paneUserStorage'] = container.lookup('service:pane_user_storage');
      conductor.services['test'] = container.lookup('service:test');

      var store = container.lookup('store:main');

      var cardId = '7f878b1a-34af-42ed-b477-878721cbc90d';

      pushPane(store, cardId);
      var questionsPane = store.find('pane', cardId); // needs to be loaded for service to return properly.

      stop();
      questionsPane.then(function(questionsPane) {
        console.log(questionsPane);
        card = conductor.load('/test/fixtures/app/services/pane_user_storage_card.js', cardId, {
          capabilities: ['paneUserStorage', 'test']
        });

        var promise = card.appendTo('#qunit-fixture');
        promise.then(null, function(e){ console.log(e); });

        mockAjax();
        start();
      });
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
    var container = isolatedContainer(
      [
      'model:pane_type',
      'model:pane',
      'model:section',
      ]);
    container.register('store:main', DS.Store.extend({
      adapter: DS.FixtureAdapter
    }));
    this.service = createServiceForTesting(PaneUserStorageService, 'card-id');
    this.service.container = container;
    var store = container.lookup('store:main');
    pushPane(store, 'card-id');
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
