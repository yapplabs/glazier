import 'glazier/utils/uuid' as uuid;

var Adapter = DS.RESTAdapter.extend({
  namespace: 'api',
  generateIdForRecord: function (store, record) {
    return uuid();
  }
});


Adapter.registerTransform('json', {
  deserialize: function (serialized) {
    return JSON.parse(serialized);
  },
  serialize: function(deserialized) {
    return JSON.stringify(deserialized);
  }
});

Adapter.registerTransform('passthrough', {
  deserialize: function (serialized) {
    return serialized;
  },
  serialize: function(deserialized) {
    return deserialized;
  }
});

export = Adapter;
