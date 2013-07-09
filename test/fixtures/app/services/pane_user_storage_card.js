var card = Conductor.card({
  consumers: {
    paneUserStorage: Conductor.Oasis.Consumer.extend({}),
    test: Conductor.Oasis.Consumer.extend({
      requests: {
        runTest:  function(promise, testData){
          var testFn = new Function('return ' + testData.fnString)();

          testFn.call(window, card, promise);
        }
      }
    })
  },

  activate: function () { }
});
