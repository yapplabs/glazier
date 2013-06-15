import 'glazier/services/login' as LoginService;
import createServiceForTesting from 'helpers/service_test_helpers';
import mockAjax from 'helpers/ajax_test_helpers';

import 'conductor' as Conductor;

module("Glazier LoginService Unit", {
  setup: function() {

    this.service = createServiceForTesting(LoginService, 'card-id');

    mockAjax();
  },
  teardown: function() {
    Ember.$.ajax.restore();
  }
});

test("sending 'loginWithGithub' logs the user in", function() {
  expect(6);

  var responseJSON = {
    id: 56,
    github_login: 'lukemelia',
    github_id: 123
  };

  mockAjax.nextResponse = responseJSON;

  var requestPayload = {
    accessToken: 'abc123'
  };

  this.service.updateName = function(name) {
    equal(name, 'lukemelia');
  };

  this.service.simulateRequest('loginWithGithub', requestPayload).then(function(userJson){
    deepEqual(userJson, {
      id: 56,
      github_login: 'lukemelia',
      github_id: 123
    }, 'correct user data');
    start();
  });

  var ajaxRequest = mockAjax.requests[0];

  ok(ajaxRequest, 'made an ajax request');

  deepEqual(ajaxRequest.data, {
    github_access_token: 'abc123'
  }, ' correct payload');

  equal(ajaxRequest.type, 'POST', 'made a POST request');
  equal(ajaxRequest.url, '/api/session.json', 'made a request to the correct endpoint');

  stop();
});
