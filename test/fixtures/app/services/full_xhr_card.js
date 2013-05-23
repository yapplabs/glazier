Conductor.card({
  consumers: {
    fullXhr: Conductor.Oasis.Consumer.extend({}),
    test: Conductor.Oasis.Consumer.extend({})
  },
  activate: function () {
    var card = this;
    this.consumers.test.request('runTest').then(function(testFnString) {
      var testFn = new Function('return ' + testFnString)();
      testFn.call(window, card);
    });
  }
});
