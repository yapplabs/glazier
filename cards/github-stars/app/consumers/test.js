import Consumer from 'conductor';

var TestConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    runTest:  function(resolver, testData){
      var testFn = new Function('return ' + testData.fnString)();
      testFn.call(window, this.card, resolver);
    }
  }
});

export default TestConsumer;
