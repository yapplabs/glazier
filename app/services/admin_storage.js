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
      var data = {},
          cardId = this.sandbox.card.id;
      data[key] = JSON.stringify(value);

      return ajax('/api/pane_entries/' + cardId + '.json', {
        type: 'PUT',
        data: { data: data }
      }).then(function(){
        Glazier.Pane.find(cardId).updatePaneEntry(key, value);
      });
    },

    /*
      @public

      @method remoteItem
      @param key {String}
    */
    removeItem: function(key) {
      var cardId = this.sandbox.card.id;
      return ajax('/api/pane_entries/' + cardId + '.json', {
        type: 'DELETE',
        data: { key: key }
      }).then(function(){
        Glazier.Pane.find(cardId).removePaneEntry(key);
      });
    }
  }
});

export default AdminStorageService;
