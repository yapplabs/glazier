var loadEmberApp = function() {

  var typeMap = {
    view: 'views',
    util: 'utils',
    route: 'routes',
    service: 'services',
    controller: 'controllers'
  };

  function classFactory(klass) {
    return {
      create: function (injections) {
        return klass.extend(injections);
      }
    };
  }

  function resolve(prefix) {
    return function(parsedName){
      var pluralizedType = typeMap[parsedName.type] || parsedName.type;
      var name = Ember.String.underscore(parsedName.fullNameWithoutType);

      var moduleName = prefix + '/' +  pluralizedType + '/' + name;
      var module;

      if (define.registry[moduleName]) {
        module = requireModule(moduleName);

        if (typeof module.create !== 'function') {
          module = classFactory(module);
        }

        if (Ember.ENV.LOG_MODULE_RESOLVER){
          console.log('hit', moduleName);
        }

        return module;
      } else  {
        if (Ember.ENV.LOG_MODULE_RESOLVER){
          console.log('miss', moduleName);
        }

        return this._super(parsedName);
      }
    };
  }

  function resolver(prefix) {
    return  Ember.DefaultResolver.extend({
      resolveOther: resolve(prefix)
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
