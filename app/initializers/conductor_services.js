var camelize = Ember.String.camelize;
import Conductor from 'conductor';

Conductor.Oasis.RSVP.configure('async', function(callback, promise) {
  Ember.run.schedule('actions', promise, callback, promise);
});

function conductorURL(){
  var url = Ember.$("meta[name='glazier-conductor-url']").attr('content');
  if (Ember.isNone(url)) {
    throw new Error("Missing Glazier Conductor url");
  }
  return url;
}

var initializer = {
  name: 'conductorServices',
  before: 'injections',
  initialize: function (container, application) {
    var conductor = new Conductor({
      conductorURL: conductorURL()
    });
    conductor.oasis.configure('eventCallback', Ember.run);
    // Conductor no longer stores the services it provides this way,
    // but we are relying on it containing our custom services later on
    conductor.services = {};
    conductor.removeDefaultCapability('height');
    application.register('conductor:main', conductor, { instantiate: false });

    Ember.keys(requirejs._eak_seen).forEach(function (moduleName) {
      var match = /^glazier\/services\/(.+)/.exec(moduleName);

      if (match) {
        var keyWithoutType = camelize(match[1]);
        var fullName = 'service:' + match[1];
        conductor.services[keyWithoutType] = container.lookup(fullName);
      }
    });
  }
};

export default initializer;
