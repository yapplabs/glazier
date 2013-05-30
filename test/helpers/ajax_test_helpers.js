function mockAjax() {
  var originalAjax = Ember.$.ajax;
  mockAjax.requests = [];

  Ember.$.ajax = function(options) {
    mockAjax.requests.push(options);
    var promise = new Conductor.Oasis.RSVP.Promise();
    promise.resolve({responseText: 'bar', statusCode: 200});
    return promise;
  };

  Ember.$.ajax.restore = function() {
    Ember.$.ajax = originalAjax;
  };
}

export mockAjax;
