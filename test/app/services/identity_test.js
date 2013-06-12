import 'glazier/services/identity' as IdentityService;
import createServiceForTesting from 'helpers/service_test_helpers';
import mockAjax from 'helpers/ajax_test_helpers';

module("Glazier IdentityService Unit", {
  setup: function() {

    this.service = createServiceForTesting(IdentityService, 'card-id');

    mockAjax();
  },
  teardown: function() {
    Ember.$.ajax.restore();
  }
});

test("sending 'oauthIdentityEstablished' logs the user in and then broadcasts the 'identified' event", function() {
  expect(6);

  var responseJSON = {
    user: {
      id: 56,
      github_login: 'lukemelia',
      github_id: 123
    }
  };

  mockAjax.nextResponse = responseJSON;

  var oauthPayload = {
    service: 'github',
    accessToken: 'abc123'
  };

  this.service.port.send = function(event, data) {
    deepEqual(data, {
      user: {
        id: 56,
        github_login: 'lukemelia',
        github_id: 123
      }
    }, 'correct user data');

    start();
  };

  this.service.updateName = function(name) {
    equal(name, 'lukemelia');
  };

  this.service.simulateSend('oauthIdentityEstablished', oauthPayload);

  var ajaxRequest = mockAjax.requests[0];

  ok(ajaxRequest, 'made an ajax request');

  deepEqual(ajaxRequest.data, {
    github_access_token: 'abc123'
  }, ' correct payload');

  equal(ajaxRequest.type, 'POST', 'made a POST request');
  equal(ajaxRequest.url, '/api/session.json', 'made a request to the correct endpoint');

  stop();
});
