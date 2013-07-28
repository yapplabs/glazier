import uuid from 'glazier/utils/uuid';

var Adapter = DS.RESTAdapter.extend({
  init: function(){
    this._super();
    this.set('bulkPositionUpdater', BulkPositionUpdater.create({ adapter: this }));
  },
  namespace: 'api',
  generateIdForRecord: function (store, record) {
    return uuid();
  },
  updateRecords: function(store, type, records) {
    if (this.bulkPositionUpdater.handles(type, records)) {
      return this.bulkPositionUpdater.doUpdate(store, type, records);
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
    return (record.get('position') !== record._data.attributes.position);
  });
}

var BulkPositionUpdater = Ember.Object.extend({
  adapter: null,
  handles: function(type, records){
    if (type.toString() === 'Glazier.Pane' && positionChanged(records)) {
      return true;
    }
    return false;
  },
  doUpdate: function(store, type, records){
    this.performApiCall(store, type, records);
    // Immediately mark the records saved
    this.adapter.didUpdateRecords(store, type, records, {});
  },
  performApiCall: function(store, type, records){
    var data = this.dataForType(type, records),
        root = this.adapter.rootForType(type);
    this.adapter.ajax(this.adapter.buildURL(root, "reorder"), "POST", { data: data });
  },
  dataForType: function(type, records) {
    var dashboard = records.list[0].get('dashboard'),
        panes = dashboard.get('panes');
    return {
      dashboard_id: dashboard.get('id'),
      pane_ids: panes.map(function(pane){
                  return { id: pane.get('id'), position: pane.get('position') };
                }).sort(function(a,b){
                  return a.position - b.position;
                }).map(function(paneData){ return paneData.id; })
    };
  }
});

export default Adapter;
