var queuePromise, testQueue = [], tests = {};

function inCard(f) {
  f.promise = new Conductor.Oasis.RSVP.Promise();
  f.testId = Ember.guidFor(f);
  testQueue.push(f);
  tests[f.testId] = f;
  if (queuePromise) {
    var test = testQueue.pop();
    queuePromise.resolve({ fnString: test.toString(), testId: test.testId });
    queuePromise = null;
  }
  return f.promise;
}

var TestService = Conductor.Oasis.Service.extend({
  requests: {
    runTest: function(promise) {
      if (testQueue.length > 0) {
        var test = testQueue.pop();
        promise.resolve({ fnString: test.toString(), testId: test.testId });
      } else {
        queuePromise = promise;
      }
    }
  },
  events: {
    finishedTest: function(testResult){
      tests[testResult.testId].promise.resolve(testResult.reason);
      delete tests[testResult.testId];
    },
    failedTest: function(testResult){
      tests[testResult.testId].promise.reject(testResult.reason);
      delete tests[testResult.testId];
    }
  }
});

export { inCard, TestService };
