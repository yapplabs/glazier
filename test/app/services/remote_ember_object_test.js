import RemoteEmberObjectService from 'glazier/services/remote_ember_object';
import { MockPort, MockChannel } from 'helpers/oasis_test_helpers';
import createServiceForTesting from 'helpers/service_test_helpers';

import Conductor from 'conductor';

var originalAjax = $.ajax;

module("RemoteEmberObjectService", {
  setup: function(){
    this.service = createServiceForTesting(RemoteEmberObjectService, 'card-id');
  },

  teardown: function(){
  }
});

test("it exists", function(){
  ok(RemoteEmberObjectService);
});

test("requesting a bucket, first time", function(){
  this.service.port.request = function(){ return Conductor.Oasis.RSVP.resolve({bar: 'baz'}); };
  var result = this.service.getBucket('foo');
  equal(result.content, undefined, "returns ObjectProxy with no content set yet");
});

test("requesting a bucket, multiple times", function(){
  this.service.port.request = function(){ return Conductor.Oasis.RSVP.resolve({bar: 'baz'}); };
  var result1 = this.service.getBucket('foo');
  var result2 = this.service.getBucket('foo');
  equal(result1, result2, "returns the same ObjectProxy");
});

test("requesting a bucket kicks off request for data, and updates the ObjectProxy", function(){
  expect(3);
  var requestPromise;
  var containerPort = {
    request: function(name, data) {
      equal('getBucketData', name, 'sent request with getBucketData');
      equal(data, 'foo', 'requested foo bucket');
      requestPromise = Conductor.Oasis.RSVP.resolve({bar: 'baz'});
      stop();
      return requestPromise;
    }
  };
  this.service.port = containerPort;
  var proxy = this.service.getBucket('foo');
  requestPromise.then(function(){
    // the bucket is now ready to be accessed
    start();
    equal(proxy.get('bar'), 'baz', 'updated the proxy');
  });
});

test("updates bucket content when events sent from card", function(){
  expect(3);
  var requestPromise;
  var containerPort = {
    request: function(name, data) {
      equal('getBucketData', name, 'sent request with getBucketData');
      equal(data, 'foo', 'requested foo bucket');
      requestPromise = Conductor.Oasis.RSVP.resolve({bar: 'baz'});
      stop();
      return requestPromise;
    }
  };
  this.service.port = containerPort;
  var proxy = this.service.getBucket('foo');
  var service = this.service;
  requestPromise.then(function(){
    start();
    service.simulateSend('updateData', { bucket: 'foo', data: { bar: 'doobie' }});
    equal(proxy.get('bar'), 'doobie', 'updates proxy content');
  });
});
