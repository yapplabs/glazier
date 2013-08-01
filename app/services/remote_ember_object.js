import Conductor from 'conductor';

/*
 * The RemoteEmberObjectService allows you to call `getBucket`
 * which "entangles" an ObjectProxy with a remote (card) data
 * bucket. The proxies content will be set as soon as the
 * initial request is fulfilled and be kept up-to-date as
 * updateData events are received from the card.
 */

var RemoteEmberObjectService = Conductor.Oasis.Service.extend({
  initialize: function(port) {
    port.service = this;
    this.sandbox.remoteEmberObjectPort = port;
    this.subscribedBuckets = {};
  },
  getBucket: function(bucketName) {
    var bucket = this.subscribedBuckets[bucketName];

    if (!bucket) {
      bucket = Ember.ObjectProxy.create({});
      this.subscribedBuckets[bucketName] = bucket;

      this.port.request('getBucketData', bucketName).then(function(data){
        bucket.set('content', data);
      }).then(null, Conductor.error);
    }
    return bucket;
  },
  events: {
    updateData: function(eventData) {
      var bucket = this.subscribedBuckets[eventData.bucket];
      if (bucket) {
        bucket.set('content', eventData.data);
      }
    }
  }
});

export default RemoteEmberObjectService;
