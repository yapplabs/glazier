import uuid from 'glazier/utils/uuid';
// this file is overriden by ziniki

var ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api',
  generateIdForRecord: function (store, record) {
    return uuid();
  },
  pathForType: function(type) {
    var decamelized = Ember.String.decamelize(type);
    return Ember.String.pluralize(decamelized);
  }
});

export default ApplicationAdapter;
