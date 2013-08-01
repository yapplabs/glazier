import { PromiseObjectProxy } from 'glazier/utils/promise_proxy';

var get = Ember.get;

/*
 * This computed property macro works hand-in-hand with the
 * RemoteEmberObjectService to return a proxy for a remote
 * data bucket which may later provide data kept in sync with
 * the remote (card) bucket.
 */
var cardBucketProp = function(cardPath, bucketName) {
  return Ember.computed(cardPath, function(){
    var cardReference = get(this, cardPath);
    if (!cardReference)  { return; }

    function getBucket(){
      var remoteEmberObjectPort = cardReference.sandbox.remoteEmberObjectPort;
      if (remoteEmberObjectPort) {
        return remoteEmberObjectPort.service.getBucket(bucketName);
      } else {
        // Card does not implement remoteEmberObjectService
        return;
      }
    }

    var bucketPromise = cardReference.sandbox.activatePromise.then(getBucket);
    return PromiseObjectProxy.create({
      promise: bucketPromise
    });
  }).readOnly();
};

export { cardBucketProp };
