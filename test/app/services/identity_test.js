import IdentityService from 'glazier/services/identity';
import createServiceForTesting from 'helpers/service_test_helpers';
import mockAjax from 'helpers/ajax_test_helpers';

// var port, card, sandbox;
module("Glazier IdentityService Unit", {
  setup: function() {
    this.service = createServiceForTesting(IdentityService, 'card-id');
    mockAjax();
  },
  teardown: function() {
    Ember.$.ajax.restore();
  }
});

asyncTest("send identified logs the user in", 3, function() {
  var responseJSON = {
    user: {
      id: 56,
      github_login: 'lukemelia',
      github_id: 123
    }
  };
  mockAjax.nextResponse = responseJSON;
  this.service.simulateSend('identified', { githubAccessToken: 'abc123' });
  var ajaxRequest = mockAjax.requests[0];
  ok(ajaxRequest, 'made an ajax request');
  equal(ajaxRequest.type, 'POST', 'made a POST request');
  equal(ajaxRequest.url, '/api/session.json', 'made a request to the correct endpoint');
  start();
});
