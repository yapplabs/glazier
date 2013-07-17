var camelize = Ember.String.camelize;
import Conductor from 'conductor';

var initializer = {
  name: 'conductorServices',
  initialize: function (container, application) {
    Ember.keys(define.registry).forEach(function (moduleName) {
      var match = /^glazier\/services\/(.+)/.exec(moduleName);

      if (match) {
        var keyWithoutType = camelize(match[1]);
        var fullName = 'service:' + match[1];
        Conductor.services[keyWithoutType] = container.lookup(fullName);
      }

    });
    // Remove the height service
    delete Conductor.services.height;
  }
};

export default initializer;
