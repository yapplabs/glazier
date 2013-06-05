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
      Conductor.services['identity'] = Conductor.Oasis.Service.extend({
        events: {
          identified: function(data) {
            Conductor.services['identity'].trigger('identified');
          }
        }
      });

      Conductor.Oasis.RSVP.EventTarget.mixin(Conductor.services['identity']);
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
        capabilities: ['fullXhr', 'configuration', 'userStorage', 'identity', 'test', 'assertion']
      });
      card.appendTo('#qunit-fixture');
    },
    teardown: function() {
      window.open = originalWindowOpen;
      Conductor.services['userStorage'].off('setItem');
      Conductor.services['identity'].off('identified');
    }
  });

  asyncTest("The card uses the github client ID from configuration", 4, function() {
    inCard(card, function(card){
      var calledWith = [];
      window.open = function(){
        start();
        calledWith = Array.prototype.slice.call(arguments);
        ok(calledWith, "expected window.open to be called");
        equal(calledWith[0], "https://github.com/login/oauth/authorize?scope=user,public_repo&client_id=abc123", 'Calls github dance with configured client ID');
        equal(calledWith[1], "authwindow", "names window");
        equal(calledWith[2], "menubar=0,resizable=1,width=960,height=410", "opens window with options");
      };
      card.render();
      $('#github_button').trigger('click');
    });
  });

  asyncTest("The card exchanges the auth code for an accessToken and persists the token as private user data", 3, function() {
    card.sandbox.activatePromise.then(function(){
      var setItemRequestPromise = new Conductor.Oasis.RSVP.Promise(),
          identifiedSentPromise = new Conductor.Oasis.RSVP.Promise();
      Conductor.services['userStorage'].on('setItem', function(){
        setItemRequestPromise.resolve();
      });
      Conductor.services['identity'].on('identified', function(){
        identifiedSentPromise.resolve();
      });
      card.sandbox.el.contentWindow.postMessage('123456', '*');
      Conductor.Oasis.RSVP.all([setItemRequestPromise, identifiedSentPromise]).then(function(){
        ok(true, 'sent identified event to identity service');
        equal(stubbedUserStorage['accessToken'], 'def456', 'persists accessToken');
        inCard(card, function(card){
          card.consumers.userStorage.request('getItem', 'accessToken').then(function(token){
            equal(token, 'def456', 'reads back the token from userStorage');
            start();
          });
        });
      });
    });
  });
}
