import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

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
          data = {},
          url = '/api/pane_type_user_entries/' + encodeURIComponent(cardTypeName) + '.json';

      if (value === undefined) { value = null; }
      data[key] = JSON.stringify(value);

      return ajax(url, {
        type: 'PUT',
        data: {data: data, access: 'private'}
      }).then(function(){
        Glazier.PaneType.find(cardTypeName).then(function(paneType) {
          paneType.updateUserEntry(key, value);
        });
        return true;
      });
    },

    /*
      @public

      @method remoteItem
      @param key {String}
    */
    removeItem: function(key) {
      var cardTypeName = this.sandbox.card.manifest.name;
      var url = '/api/pane_type_user_entries/' + encodeURIComponent(cardTypeName) + '.json';

      return ajax(url, {
        type: 'DELETE',
        data: {key: key, access: 'private'}
      }).then(function(){
        Glazier.PaneType.find(cardTypeName).then(function(paneType) {
          paneType.removeUserEntry(key);
        });
        return true;
      });
    }
  }
});

export default PaneTypeUserStorageService;
