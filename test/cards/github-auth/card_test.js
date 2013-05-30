var conductor, card, originalWindowOpen, stubbedUserStorage;

import { inCard, TestService } from 'helpers/card_test_helpers';

if (!/phantom/i.test(navigator.userAgent)) {
  module("Glazier GithubAuth card", {
    setup: function() {
      conductor = new Conductor({
        testing: true
      });

      Conductor.services['configuration'] = Conductor.Oasis.Service.extend({
        requests: {
          configurationValue: function(promise, key) {
            promise.resolve('abc123');
          }
        }
      });
      Conductor.services['fullXhr'] = Conductor.Oasis.Service.extend({
        requests: {
          ajax: function(promise, options) {
            promise.resolve('def456');
          }
        }
      });
      Conductor.services['userStorage'] = Conductor.Oasis.Service.extend({
        requests: {
          //http://dev.w3.org/html5/webstorage/#storage-0
          getItem: function(promise, key) {
            promise.resolve(stubbedUserStorage[key]);
          },
          setItem: function(promise, key, value) {
            stubbedUserStorage[key] = value;
            promise.resolve();
            Conductor.services['userStorage'].trigger('setItem');
          }//,
          //length
          //key(i)
          //removeItem
          //clear
        }
      });
      Conductor.Oasis.RSVP.EventTarget.mixin(Conductor.services['userStorage']);
      stubbedUserStorage = {};
      Conductor.services['test'] = TestService;
      originalWindowOpen = window.open;
      window.open = function(){
        window.open.calledWith.push(Array.slice.apply(arguments));
      };
      window.open.calledWith = [];

      card = conductor.load('/cards/github-auth/card.js', 1, {
        capabilities: ['fullXhr', 'configuration', 'userStorage', 'test', 'assertion']
      });
      card.appendTo('#qunit-fixture');
    },
    teardown: function() {
      window.open = originalWindowOpen;
      Conductor.services['userStorage'].off('setItem');
    }
  });

  asyncTest("The card uses the github client ID from configuration", 4, function() {
    inCard(function(card){
      var calledWith = [];
      window.open = function(){
        start();
        calledWith = Array.prototype.slice.call(arguments);
        ok(calledWith, "expected window.open to be called");
        equal(calledWith[0], "https://github.com/login/oauth/authorize?scope=gist&client_id=abc123", 'Calls github dance with configured client ID');
        equal(calledWith[1], "authwindow", "names window");
        equal(calledWith[2], "menubar=0,resizable=1,width=960,height=410", "opens window with options");
      };
      card.render();
      $('#github_button').trigger('click');
    });
  });

  asyncTest("The card exchanges the auth code for an accessToken and persists the token as private user data", 2, function() {
    card.sandbox.activatePromise.then(function(){
      card.sandbox.el.contentWindow.postMessage('123456', '*');
      Conductor.services['userStorage'].on('setItem', function(){
        equal(stubbedUserStorage['accessToken'], 'def456', 'persists accessToken');
        inCard(function(card){
          card.consumers.userStorage.request('getItem', 'accessToken').then(function(token){
            equal(token, 'def456', 'reads back the token from userStorage');
            start();
          });
        });
      });
    });
  });
}
