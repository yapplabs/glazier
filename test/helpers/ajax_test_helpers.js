var Conductor = requireModule('conductor');

function mockAjax() {
  var originalAjax = Ember.$.ajax;
  mockAjax.requests = [];

  Ember.$.ajax = function(url, options) {
    options.url = url;
    mockAjax.requests.push(options);
    var response = mockAjax.nextResponse;
    options.success(response);
    return new Conductor.Oasis.RSVP.Promise(function(resolve, reject){
      resolve(response || {});
      mockAjax.nextResponse = null;
    });
  };

  Ember.$.ajax.restore = function() {
    Ember.$.ajax = originalAjax;
  };
}

export default mockAjax;
