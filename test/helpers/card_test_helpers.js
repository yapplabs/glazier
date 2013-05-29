var queuePromise;
var testQueue = [];

function inCard(f) {
  testQueue.push(f);
  if (queuePromise) {
    queuePromise.resolve(testQueue.pop().toString());
    queuePromise = null;
  }
}

var TestService = Conductor.Oasis.Service.extend({
  requests: {
    runTest: function(promise) {
      if (testQueue.length > 0) {
        promise.resolve(testQueue.pop().toString());
      } else {
        queuePromise = promise;
      }
    }
  }
});

export { inCard, TestService };
