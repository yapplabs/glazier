import Conductor from 'conductor';

var TestConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    runTest:  function(testData) {
      var testFn = new Function('return ' + testData.fnString)();

      return Conductor.Oasis.RSVP.Promise(function(resolve, reject){
        testFn.call(window, this.card, {
          resolve: resolve,
          reject: reject
        });
      });
    }
  }
});

export default TestConsumer;
