import 'glazier/utils/uuid' as uuid;

var Adapter = DS.RESTAdapter.extend({
  namespace: 'api',
  generateIdForRecord: function (store, record) {
    return uuid();
  }
});

export = Adapter;
