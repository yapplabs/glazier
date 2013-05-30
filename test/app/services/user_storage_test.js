import UserStorageService from 'glazier/services/user_storage';
import assertResolved from 'helpers/promise_test_helpers';
import { inCard, TestService } from 'helpers/card_test_helpers';

var conductor, card, ajaxRequests;

if (!/phantom/i.test(navigator.userAgent)) {
  module("Glazier UserStorageService", {
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
      this.originalAjax = Ember.$.ajax;
      ajaxRequests = [];

      Ember.$.ajax = function(options) {
        ajaxRequests.push(options);
        var promise = new Conductor.Oasis.RSVP.Promise();
        promise.resolve({responseText: 'bar', statusCode: 200});
        return promise;
      };
    },
    teardown: function(){
      Ember.$.ajax = this.originalAjax;
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
