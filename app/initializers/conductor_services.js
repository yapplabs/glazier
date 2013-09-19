var camelize = Ember.String.camelize;
import Conductor from 'conductor';

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
    // Remove the height service
    conductor.services.height = Conductor.Oasis.Service.extend({});
    conductor.oasis.configure('eventCallback', Ember.run);
    application.register('conductor:main', conductor, { instantiate: false });

    Ember.keys(define.registry).forEach(function (moduleName) {
      var match = /^glazier\/services\/(.+)/.exec(moduleName);

      if (match) {
        var keyWithoutType = camelize(match[1]);
        var fullName = 'service:' + match[1];
        conductor.services[keyWithoutType] = container.lookup(fullName);
      }

    });
    // Remove the height service
    delete conductor.services.height;
  }
};

export default initializer;
