import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

var AdminStorageService = Conductor.Oasis.Service.extend({

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method setItem
      @param key {String}
      @param value {Object}
    */
    setItem: function(key, value) {
      var data = {};
      data[key] = JSON.stringify(value);

      return ajax('/api/pane_entries/' + this.sandbox.card.id + '.json', {
        type: 'PUT',
        data: { data: data }
      });
    },

    /*
      @public

      @method remoteItem
      @param key {String}
    */
    removeItem: function(key) {
      return ajax('/api/pane_entries/' + this.sandbox.card.id + '.json', {
        type: 'DELETE',
        data: { key: key }
      });
    }
  }
});

export default AdminStorageService;
