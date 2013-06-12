if (typeof define !== 'function' && typeof requireModule !== 'function') {
  var define, requireModule;

  (function() {
    var registry = {}, seen = {};

    define = function(name, deps, callback) {
      registry[name] = { deps: deps, callback: callback };
    };

    requireModule = function(name) {
      if (seen[name]) { return seen[name]; }
      seen[name] = {};

      var mod = registry[name];

      if (!mod) {
        throw new Error("Module: '" + name + "' not found.");
      }

      var deps = mod.deps,
          callback = mod.callback,
          reified = [],
          exports;

      for (var i=0, l=deps.length; i<l; i++) {
        if (deps[i] === 'exports') {
          reified.push(exports = {});
        } else {
          reified.push(requireModule(deps[i]));
        }
      }

      var value = callback.apply(this, reified);
      return seen[name] = exports || value;
    };

    define.registry = registry;
    define.seen = seen;
  })();
}

define("resolver",
  [],
  function() {
    "use strict";
  /*
   * This module defines a subclass of Ember.DefaultResolver that adds two
   * important features:
   *
   *  1) The module system provided by es6-module-transpiler and
   *     vendor/loader is consulted so that classes can be resolved
   *     directly cia the module loader, without needing a manual `require`.
   *  2) is able provide injections to classes that implement `extend`
   *     (as is typical with Ember).
   */
  var typeMap = {
    view: 'views',
    util: 'utils',
    route: 'routes',
    service: 'services',
    controller: 'controllers'
  };

  function classFactory(klass) {
    Ember.assert("classFactory must be used with a class that implements `extend`", typeof klass.extend === 'function');
    return {
      create: function (injections) {
        return klass.extend(injections);
      }
    };
  }

  var underscore = Ember.String.underscore;

  function resolveOther(parsedName){
    var prefix = this.namespace.modulePrefix;
    Ember.assert('module prefix must be defined', prefix);

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
  }

  var Resolver = Ember.DefaultResolver.extend({
    resolveOther: resolveOther
  });

  return Resolver;
});
