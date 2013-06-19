var camelize = Ember.String.camelize;
import 'conductor' as Conductor;

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
  }
};

export = initializer;
