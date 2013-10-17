import Router from 'glazier/router';
import Resolver from 'resolver';

var NEED_CLASS_FACTORY = ['service', 'behavior'];

var Application = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  modulePrefix: 'glazier',
  Router: Router,
  Resolver: Resolver.extend({
    shouldWrapInClassFactory: function(module, parsedName){
      // ember-app-kit's resolver treats an object with extend as something
      // that can have reopenClass called on it. Some of our non-Ember
      // classes don't fit this pattern.
      if (NEED_CLASS_FACTORY.indexOf(parsedName.type) !== -1) {
        return true;
      } else {
        return this._super(module, parsedName);
      }
    }
  })
});

export default Application;
