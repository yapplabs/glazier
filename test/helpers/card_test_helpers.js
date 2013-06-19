var Conductor = requireModule('conductor');

function inCard(card, fn) {

  if (arguments.length !== 2){
    throw new TypeError('inCard requires 2 arguments, (card, function)');
  }

  fn.deferred = new Conductor.Oasis.RSVP.defer();
  fn.testId = Ember.guidFor(fn);

  return card.sandbox.activatePromise.then(function(){
    var service = card.sandbox.testServicePort;

    var run = {
      fnString: fn.toString(),
      testId: fn.testId
    };

    return service.request('runTest', run);
  });
}

var TestService = Conductor.Oasis.Service.extend({
  initialize: function(port) {
    this.sandbox.testServicePort = port;
  }
});

export { inCard, TestService };
