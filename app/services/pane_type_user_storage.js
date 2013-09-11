import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

function apiUrl(cardTypeName) {
  cardTypeName = encodeURIComponent(cardTypeName);
  return '/api/pane_type_user_entries/' + cardTypeName + '.json';
}

function findPaneType(container, cardTypeName) {
  var store = container.lookup('store:main');
  return store.find('pane_type', cardTypeName);
}

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
          paneTypePromise = findPaneType(this.container, cardTypeName);

      if (value === undefined) { value = null; }
      data[key] = JSON.stringify(value);

      var ajaxOptions = {
        type: 'PUT',
        data: {data: data, access: 'private'}
      };

      function updateUserEntry() {
        return paneTypePromise.then(function(paneType){
          paneType.updateUserEntry(key, value);
        });
      }

      return ajax(apiUrl(cardTypeName), ajaxOptions)
            .then(updateUserEntry)
            .then(null, Conductor.error);
    },

    /*
      @public

      @method remoteItem
      @param key {String}
    */
    removeItem: function(key) {
      var cardTypeName = this.sandbox.card.manifest.name,
          paneTypePromise = findPaneType(this.container, cardTypeName),
          ajaxOptions = {
            type: 'DELETE',
            data: {key: key, access: 'private'}
          };

      function removeUserEntry(){
        return paneTypePromise.then(function(paneType) {
          paneType.removeUserEntry(key);
        });
      }

      return ajax(apiUrl(cardTypeName), ajaxOptions)
             .then(removeUserEntry)
             .then(null, Conductor.error);
    }
  }
});

export default PaneTypeUserStorageService;
