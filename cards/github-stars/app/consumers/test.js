import Conductor from 'conductor';

var TestConsumer = Conductor.Oasis.Consumer.extend({
  requests: {
    runTest:  function(testData) {
      var testFn = new Function('return ' + testData.fnString)();
      var card = this.card;

      return Conductor.Oasis.RSVP.Promise(function(resolve, reject){
        resolve(testFn.call(window, card));
      });
    }
  }
});

export default TestConsumer;
