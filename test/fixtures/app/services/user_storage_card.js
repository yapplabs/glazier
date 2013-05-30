Conductor.card({
  consumers: {
    userStorage: Conductor.Oasis.Consumer.extend({}),
    test: Conductor.Oasis.Consumer.extend({})
  },
  activate: function () {
    var card = this;
    card.consumers.test.request('runTest').then(function(testData) {
      var testFn = new Function('return ' + testData.fnString)();
      var promise = new Conductor.Oasis.RSVP.Promise();
      testFn.call(window, card, promise);
      promise.then(function(resolveReason){
        card.consumers.test.send('finishedTest', {testId: testData.testId, reason: resolveReason});
      }, function(rejectReason){
        card.consumers.test.send('failedTest', {testId: testData.testId, reason: rejectReason});
      });
    });
  }
});
