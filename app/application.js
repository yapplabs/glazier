import Router from 'glazier/router';
import Store from 'glazier/store';

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
      if (typeof klass.extend === 'function') {
        return klass.extend(injections);
      } else {
        return klass;
      }
    }
  };
}

var underscore = Ember.String.underscore;
function resolve(prefix) {
  return function(parsedName){

    var pluralizedType = typeMap[parsedName.type] || parsedName.type;
    var name = parsedName.fullNameWithoutType;

    var moduleName = prefix + '/' +  pluralizedType + '/' + underscore(name);
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

var Application = Ember.Application.extend({
  Router: Router,
  Store: Store,
  resolver: resolver('glazier')
});

export Application;
