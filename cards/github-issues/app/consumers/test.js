import 'conductor' as Conductor;

var TestConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    runTest:  function(resolver, testData){
      var testFn = new Function('return ' + testData.fnString)();
      testFn.call(window, this.card, resolver);
    }
  }
});

export = TestConsumer;
