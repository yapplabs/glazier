var card = Conductor.card({
  consumers: {
    paneTypeUserStorage: Conductor.Oasis.Consumer.extend({}),
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
