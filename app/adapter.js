import uuid from 'glazier/utils/uuid';

var Adapter = DS.RESTAdapter.extend({
  init: function(){
    this._super();
    this.set('bulkOrderUpdater', BulkOrderUpdater.create());
  },
  namespace: 'api',
  generateIdForRecord: function (store, record) {
    return uuid();
  },
  updateRecords: function(store, type, records) {
    if (this.bulkOrderUpdater.handles(type, records)) {
      return this.bulkOrderUpdater.doUpdate(store, type, records);
    }
    else {
      return this._super(store, type, records);
    }
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

function positionChanged(records){
  // This is a hack. Hopefully, we will find a nicer way
  return records.toArray().every(function(record){
    return (record.get('position') !== record._data.attributes.sortOrder);
  });
}

var BulkOrderUpdater = Ember.Object.extend({
  handles: function(type, records){
    if (type.toString() === 'Glazier.Pane' && positionChanged(records)) {
      return true;
    }
    return false;
  },
  doUpdate: function(store, type, records){
    this.queueApiCall(store, type, records);
    store.get('adapter').didUpdateRecords(store, type, records, {});
  }
});

export default Adapter;
