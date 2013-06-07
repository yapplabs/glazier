var initializer = {
  name: 'conductorServices',
  initialize: function (container, application) {
    Conductor.services.configuration = container.lookup('service:configuration');
    Conductor.services.repository = container.lookup('service:repository');
    Conductor.services.fullXhr = container.lookup('service:fullXhr');
    Conductor.services.userStorage = container.lookup('service:userStorage');
    Conductor.services.identity = container.lookup('service:identity');
    Conductor.services.login = container.lookup('service:login');
  }
};

export = initializer;
