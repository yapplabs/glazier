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

      return module;
    } else  {
      return this._super(parsedName);
    }
  };
}

function Resolver(prefix) {
  return  Ember.DefaultResolver.extend({
    resolveOther: resolve(prefix)
  });
}

var Application = Ember.Application.extend({
  Router: Router,
  Store: Store,
  resolver: Resolver('glazier'),
});

export Application;
