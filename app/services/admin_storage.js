import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

function apiUrl(cardId) {
  return '/api/pane_entries/' + cardId + '.json';
}

function findPane(container, cardId) {
  var store = container.lookup('store:main');
  return store.find('pane', cardId);
}

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
          cardId = this.sandbox.card.id,
          panePromise = findPane(this.container, cardId);

      if (value === undefined) { value = null; }
      data[key] = JSON.stringify(value);

      function updatePaneEntry() {
        return panePromise.then(function(pane) {
          pane.updatePaneEntry(key, value);
        });
      }
      var ajaxOptions = { type: 'PUT', data: { data: data } };

      return ajax(apiUrl(cardId), ajaxOptions)
             .then(updatePaneEntry)
             .then(null, Conductor.error);
    },

    /*
      @public

      @method remoteItem
      @param key {String}
    */
    removeItem: function(key) {
      var cardId = this.sandbox.card.id,
          panePromise = findPane(this.container, cardId);

      function removePaneEntry(){
        return panePromise.then(function(pane) {
          pane.removePaneEntry(key);
        });
      }

      var ajaxOptions = { type: 'DELETE', data: { key: key } };
      return ajax(apiUrl(cardId), ajaxOptions)
            .then(removePaneEntry)
            .then(null, Conductor.error);
    }
  }
});

export default AdminStorageService;
