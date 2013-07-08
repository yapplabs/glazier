var Conductor = requireModule('conductor');

function mockAjax() {
  var originalAjax = Ember.$.ajax;
  mockAjax.requests = [];

  Ember.$.ajax = function(options) {
    mockAjax.requests.push(options);
    return new Conductor.Oasis.RSVP.Promise(function(resolve, reject){
      resolve(mockAjax.nextResponse || {});
      mockAjax.nextResponse = null;
    });
  };

  Ember.$.ajax.restore = function() {
    Ember.$.ajax = originalAjax;
  };
}

export default mockAjax;
