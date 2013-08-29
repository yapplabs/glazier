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
      var data = {},
          cardId = this.sandbox.card.id,
          url = '/api/pane_user_entries/' + cardId + '.json';

      data[key] = JSON.stringify(value);

      return ajax(url, {
        type: 'PUT',
        data: {data: data, access: 'private'}
      }).then(function(){
        Glazier.Pane.find(cardId).then(function(pane) {
          pane.updatePaneUserEntry(key, value);
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
      var cardId = this.sandbox.card.id,
          url = '/api/pane_user_entries/' + cardId + '.json';

      return ajax(url, {
        type: 'DELETE',
        data: {key: key, access: 'private'}
      }).then(function(){
        Glazier.Pane.find(cardId).then(function(pane) {
          pane.removePaneUserEntry(key);
        });
        return true;
      });
    }
  }
});

export default PaneUserStorageService;
