import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

var PaneUserStorageService = Conductor.Oasis.Service.extend({

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
      var url = '/api/pane_user_entries/' + this.sandbox.card.id + '.json';

      data[key] = JSON.stringify(value);

      return ajax(url, {
        type: 'PUT',
        data: {data: data, access: 'private'}
      });
    },

    /*
      @public

      @method remoteItem
      @param key {String}
    */
    removeItem: function(key) {
      var url = '/api/pane_user_entries/' + this.sandbox.card.id + '.json';

      return ajax(url, {
        type: 'DELETE',
        data: {key: key, access: 'private'}
      });
    }
  }
});

export default PaneUserStorageService;
