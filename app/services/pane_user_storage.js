import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

function apiUrl(cardId) {
  return '/api/pane_user_entries/' + cardId + '.json';
}

function findPane(container, cardId) {
  var store = container.lookup('store:main');
  return store.find('pane', cardId);
}

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
          panePromise = findPane(this.container, cardId);

      if (value === undefined) { value = null; }
      data[key] = JSON.stringify(value);

      var ajaxOptions = {
        type: 'PUT',
        data: {data: data, access: 'private'}
      };

      function updatePaneUserEntry(){
        return panePromise.then(function(pane) {
          pane.updatePaneUserEntry(key, value);
        });
      }

      return ajax(apiUrl(cardId), ajaxOptions)
            .then(updatePaneUserEntry)
            .then(null, Conductor.error);
    },

    /*
      @public

      @method remoteItem
      @param key {String}
    */
    removeItem: function(key) {
      var cardId = this.sandbox.card.id,
          panePromise = findPane(this.container, cardId),
          ajaxOptions = {
            type: 'DELETE',
            data: {key: key, access: 'private'}
          };

      function removePaneUserEntry(){
        return panePromise.then(function(pane) {
          pane.removePaneUserEntry(key);
        });
      }

      return ajax(apiUrl(cardId), ajaxOptions)
            .then(removePaneUserEntry)
            .then(null, Conductor.error);
    }
  }
});

export default PaneUserStorageService;
