import 'glazier/services/identity' as IdentityService;
import createServiceForTesting from 'helpers/service_test_helpers';
import mockAjax from 'helpers/ajax_test_helpers';

import 'conductor' as Conductor;

module("Glazier IdentityService Unit", {
  setup: function() {
    this.userController = Ember.Controller.create();
    this.service = createServiceForTesting(IdentityService.extend({
      userController: this.userController
    }), 'card-id');

    this.service.initialize();
    this.service.port.send = function () {
      // stub
    };
  },
  teardown: function() {
  }
});

test("sends 'currentUserChanged' when userController content changes", function () {
  var user = {};

  this.service.port.send = function(event, data) {
    equal(event, 'currentUserChanged');
    equal(data, user);
    start();
  };

  stop();
  Ember.run(this, function () {
    this.userController.set('content', user);
  });
});

test("request 'currentUser' should resolve with the userController content", function () {
  var user = {};
  Ember.run(this, function () {
    this.userController.set('content', user);
  });

  stop();
  this.service.simulateRequest('currentUser').then(function (userJson) {
    equal(userJson, user);
    start();
  });
});
