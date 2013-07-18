var card = Conductor.card({
  consumers: {
    fullXhr: Conductor.Oasis.Consumer.extend({}),
    test: Conductor.Oasis.Consumer.extend({
      requests: {
        runTest:  function(testData) {
          var testFn = new Function('return ' + testData.fnString)();

          return Conductor.Oasis.RSVP.Promise(function(resolve, reject) {
            resolve(testFn.call(window, card));
          });
        }
      }
    })
  },

  activate: function () { }
});
