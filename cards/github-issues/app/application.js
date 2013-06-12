var loadEmberApp = function() {

  function resolve(prefix) {
    return function(parsedName) {
      var moduleName = prefix + parsedName.fullNameWithoutType;

      if (define.registry[moduleName]) {
        console.log('Module hit:', moduleName);
        return requireModule(moduleName);
      } else {
        console.log('Module miss:', moduleName);
        return this._super(parsedName);
      }
    };
  }

  function resolver(prefix) {
    return Ember.DefaultResolver.extend({
      resolveController: resolve(prefix + '/controllers/'),
      resolveView:       resolve(prefix + '/views/')
    });
  }

  var App = Ember.Application.create({
    rootElement: '#card',
    resolver: resolver('app')
  });

  App.deferReadiness();
  requireModule('templates');
  return App;
};

export loadEmberApp;
