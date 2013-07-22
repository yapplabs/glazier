import Conductor from 'conductor';

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
      data[key] = JSON.stringify(value);

      return $.ajax({
        url: '/api/pane_user_entries/' + this.sandbox.card.id + '.json',
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
      return $.ajax({
        url: '/api/pane_user_entries/' + this.sandbox.card.id + '.json',
        type: 'DELETE',
        data: {key: key, access: 'private'}
      });
    }
  }
});

export default PaneUserStorageService;
