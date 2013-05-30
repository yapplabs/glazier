import UserStorageService from 'glazier/services/user_storage';
import assertResolved from 'helpers/promise_test_helpers';
import { inCard, TestService } from 'helpers/card_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';

var conductor, card, ajaxRequests;

function mockAjaxRequests() {
  var originalAjax = Ember.$.ajax;
  ajaxRequests = [];

  Ember.$.ajax = function(options) {
    ajaxRequests.push(options);
    var promise = new Conductor.Oasis.RSVP.Promise();
    promise.resolve({responseText: 'bar', statusCode: 200});
    return promise;
  };

  Ember.$.ajax.restore = function() {
    Ember.$.ajax = originalAjax;
  };
}

if (!/phantom/i.test(navigator.userAgent)) {
  module("Glazier UserStorageService Integration", {
    setup: function() {
      conductor = new Conductor({
        testing: true
      });
      Conductor.services['userStorage'] = UserStorageService;
      Conductor.services['test'] = TestService;

      card = conductor.load('/test/fixtures/app/services/user_storage_card.js', 1, {
        capabilities: ['userStorage', 'test', 'assertion']
      });
      card.appendTo('#qunit-fixture');

      mockAjaxRequests();
    },
    teardown: function(){
      Ember.$.ajax.restore();
    }
  });

  asyncTest("A card can persist a key value pair via the service", 2, function() {
    inCard(function(card, resolver){
      var service = card.consumers.userStorage;
      service.request('setItem', 'foo', 'bar').then(function(){
        resolver.resolve('setItemCalled');
      }, function(){
        resolver.reject('service request setItem failed');
      });
    }).then(function(){
      var ajaxRequest = ajaxRequests[0];
      ok(ajaxRequest, 'made an ajax request');
      equal(ajaxRequest && ajaxRequest.type, 'POST', 'made a POST request');
      start();
    }, function(reason){
      ok(false, reason);
      start();
    });
  });

  asyncTest("A card can retrieve a value by key via the service", 3, function() {
    inCard(function(card, resolver){
      var service = card.consumers.userStorage;
      service.request('getItem', 'foo').then(function(value){
        equal(value, 'bar', "expected to get bar for foo");
        resolver.resolve('getItemCalled');
      }, function(){
        resolver.reject('service request getItem failed');
      });
    }).then(function(){
      var ajaxRequest = ajaxRequests[0];
      ok(ajaxRequest, 'made an ajax request');
      equal(ajaxRequest && ajaxRequest.type, 'GET', 'made a GET request');
      start();
    }, function(reason){
      ok(false, reason);
      start();
    });
  });
}

// var port, card, sandbox;
module("Glazier UserStorageService Unit", {
  setup: function() {
    this.service = createServiceForTesting(UserStorageService, 'card-id');
    mockAjaxRequests();
  },
  teardown: function() {
    Ember.$.ajax.restore();
  }
});

asyncTest("setItem POSTs to /card/:card_id/user", 3, function() {
  this.service.simulateRequest('setItem', "name", "stef").then(function() {
    var ajaxRequest = ajaxRequests[0];
    ok(ajaxRequest, 'made an ajax request');
    equal(ajaxRequest && ajaxRequest.type, 'POST', 'made a POST request');
    equal(ajaxRequest && ajaxRequest.url, '/card/card-id/user', 'made a request to the correct endpoint');
    start();
  }, function(e) {
    ok(false, "failed");
    start();
  });
});

