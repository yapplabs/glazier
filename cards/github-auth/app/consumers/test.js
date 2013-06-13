var TestConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    runTest:  function(promise, testData){
      var testFn = new Function('return ' + testData.fnString)();

      testFn.call(window, this.card, promise);
    }
  }
});

export = TestConsumer;
