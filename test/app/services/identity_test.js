import IdentityService from 'glazier/services/identity';
import createServiceForTesting from 'helpers/service_test_helpers';
import mockAjax from 'helpers/ajax_test_helpers';

import UserController from 'glazier/controllers/user';

module("Glazier IdentityService Unit", {
  setup: function() {
    this.userController = UserController.create();
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
    start();
    equal(event, 'currentUserChanged');
    equal(data, user);
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
    start();
    equal(userJson, user);
  });
});
