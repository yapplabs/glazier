import 'glazier/services/authenticated_github_api' as AuthenticatedGithubApiService;
import { MockPort, MockChannel } from 'helpers/oasis_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';

import 'conductor' as Conductor;

var originalAjax = $.ajax;

module("AuthenticatedGithubApiService", {
  setup: function(){
    this.service = createServiceForTesting(AuthenticatedGithubApiService, 'card-id');
    this.service.userController = Ember.Controller.create({});
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
  expect(4);

  var responseJSON = {
        someOther: 'data'
      },
      requestPayload = {
        url: '/path',
        dataType: 'json'
      };

  stop();

  $.ajax = function(ajaxOpts) {
    var deferred = Conductor.Oasis.RSVP.defer();

    equal(ajaxOpts.url, 'https://api.github.com/path', 'the url was re-written to include the path');
    var xhr = {
      setRequestHeader: function(header, value) {
        equal(header, 'Authorization');
        equal(value, 'token abc123');
      }
    };
    ajaxOpts.beforeSend(xhr);

    setTimeout(function(){
      deferred.resolve(responseJSON);
    }, 0);

    return deferred.promise;
  };

  this.service.simulateRequest('ajax', requestPayload).then(function(response){
    start();

    deepEqual(response, responseJSON, 'expected response');

  }).then(null, function(reason){
    start();
    ok(false, reason);
  });
});
