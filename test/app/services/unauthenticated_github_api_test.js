import 'glazier/services/unauthenticated_github_api' as UnauthenticatedGithubApiService;
import { MockPort, MockChannel } from 'helpers/oasis_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';

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
    var promise = new Conductor.Oasis.RSVP.Promise();

    equal(data.url, 'https://api.github.com/path', 'the url was re-written to include the path');
    deepEqual(data, requestPayload, 'expected payloaded');


    setTimeout(function(){
      promise.resolve(responseJSON);
    }, 0);

    return promise;
  };

  this.service.simulateRequest('ajax', requestPayload).then(function(response){
    start();

    deepEqual(response, responseJSON, 'expected response');

  }).then(null, function(reason){
    start();
    ok(false, reason);
  });
});
