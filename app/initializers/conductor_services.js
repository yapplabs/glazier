var initializer = {
  name: 'conductorServices',
  initialize: function (container, application) {
    container.registry.eachLocal(function (key) {
      var match = /^service:(.+)/.exec(key);
      if (match) {
        var keyWithoutType = match[1];
        Conductor.services[keyWithoutType] = container.lookup(key);
      }
    });
  }
};

export = initializer;
