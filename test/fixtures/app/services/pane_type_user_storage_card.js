var card = Conductor.card({
  consumers: {
    paneTypeUserStorage: Conductor.Oasis.Consumer.extend({}),
    test: Conductor.Oasis.Consumer.extend({
      requests: {
        runTest:  function(testData){
          var testFn = new Function('return ' + testData.fnString)();

          return testFn.call(window, card);
        }
      }
    })
  },

  activate: function () { }
});
