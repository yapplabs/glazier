import 'glazier/services/authenticated_github_api' as AuthenticatedGithubApiService;
import { MockPort, MockChannel } from 'helpers/oasis_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';

var originalAjax = $.ajax;

module("AuthenticatedGithubApiService", {
  setup: function(){
    this.service = createServiceForTesting(AuthenticatedGithubApiService, 'card-id');
    this.service.userController = Em.Controller.create({});
    this.service.userController.set('accessToken', 'abc123');
  },

  teardown: function(){
    $.ajax = originalAjax;
  }
});

test("it exists", function(){
  ok(AuthenticatedGithubApiService);
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

  $.ajax = function(ajaxOpts) {
    var promise = new Conductor.Oasis.RSVP.Promise();

    equal(ajaxOpts.url, 'https://api.github.com/path', 'the url was re-written to include the path');
    deepEqual(ajaxOpts.data, { access_token: 'abc123'}, 'adds access_token');

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
