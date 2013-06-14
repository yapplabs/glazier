import 'glazier/adapter' as Adapter;

var Store = DS.Store.extend({
  adapter: Adapter
});

export = Store;
