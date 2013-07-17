import AuthenticatedGithubApiService from 'glazier/services/authenticated_github_api';
import { MockPort, MockChannel } from 'helpers/oasis_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';

import Conductor from 'conductor';

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
    equal(ajaxOpts.url, 'https://api.github.com/path', 'the url was re-written to include the path');
    var xhr = {
      setRequestHeader: function(header, value) {
        equal(header, 'Authorization');
        equal(value, 'token abc123');
      }
    };

    ajaxOpts.beforeSend(xhr);

    return Conductor.Oasis.RSVP.resolve(responseJSON);
  };

  this.service.simulateRequest('ajax', requestPayload).then(function(response){
    start();

    deepEqual(response, responseJSON, 'expected response');

  }).then(null, function(reason){
    start();
    ok(false, reason);
  });
});
