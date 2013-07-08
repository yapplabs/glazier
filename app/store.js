import Adapter from 'glazier/adapter';

var Store = DS.Store.extend({
  adapter: Adapter
});

export default Store;
