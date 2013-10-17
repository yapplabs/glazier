import Resolver from 'resolver';

var NEED_CLASS_FACTORY = ['service', 'behavior'];

function isolatedContainer(fullNames) {
  var container = new Ember.Container();
  var resolver = Resolver.extend({
    shouldWrapInClassFactory: function(module, parsedName){
      if (NEED_CLASS_FACTORY.indexOf(parsedName.type) !== -1) {
        return true;
      } else {
        return this._super(module, parsedName);
      }
    }
  }).create();
  resolver.namespace = {
    modulePrefix: 'glazier'
  };

  for (var i = fullNames.length; i > 0; i--){
    var fullName = fullNames[i - 1];
    container.register(fullName, resolver.resolve(fullName));
  }

  return container;
}

export default isolatedContainer;
