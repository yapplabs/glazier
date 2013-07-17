import Conductor from 'conductor';

var PaneTypeUserStorageService = Conductor.Oasis.Service.extend({

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
      var cardTypeName = this.sandbox.card.manifest.name,
          data = {};
      data[key] = value;

      return $.ajax({
        url: '/api/pane_type_user_entries/' + encodeURIComponent(cardTypeName) + '.json',
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
      var cardTypeName = this.sandbox.card.manifest.name;

      return $.ajax({
        url: '/api/pane_type_user_entries/' + encodeURIComponent(cardTypeName) + '.json',
        type: 'DELETE',
        data: {key: key, access: 'private'}
      });
    }
  }
});

export default PaneTypeUserStorageService;
