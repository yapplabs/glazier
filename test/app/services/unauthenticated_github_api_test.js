import UnauthenticatedGithubApiService from 'glazier/services/unauthenticated_github_api';
import { MockPort, MockChannel } from 'helpers/oasis_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';

import Conductor from 'conductor';

var originalAjax = $.ajax;

module("UnauthenticatedGithubApiService", {
  setup: function(){
    this.service = createServiceForTesting(UnauthenticatedGithubApiService, 'card-id');
  },

  teardown: function(){
    $.ajax = originalAjax;
  }
});

test("it exists", function(){
  ok(UnauthenticatedGithubApiService);
});

test("requesting issues", function(){
  expect(3);

  var responseJSON = { 
        someOther: 'data'
      },
      requestPayload = {
        url: '/path',
        dataType: 'json'
      };

  stop();

  $.ajax = function(data) {
    return Conductor.Oasis.RSVP.Promise(function(resolve, reject){
      equal(data.url, 'https://api.github.com/path', 'the url was re-written to include the path');
      deepEqual(data, requestPayload, 'expected payloaded');

      setTimeout(function(){
        resolve(responseJSON);
      }, 0);
    });
  };

  this.service.simulateRequest('ajax', requestPayload).then(function(response){
    start();

    deepEqual(response, responseJSON, 'expected response');

  }).then(null, function(reason){
    start();
    ok(false, reason);
  });
});
