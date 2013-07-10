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
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param key {String}
      @param value {Object}
    */
    setItem: function(promise, key, value) {
      var cardTypeName = this.sandbox.card.manifest.name,
          data = {};
      data[key] = value;
      $.ajax({
        url: '/api/pane_type_user_entries/' + encodeURIComponent(cardTypeName) + '.json',
        type: 'PUT',
        data: {data: data, access: 'private'}
      }).then(function(r){
        promise.resolve(r);
      }, function(r){
        promise.reject(r);
      });
    },

    /*
      @public

      @method remoteItem
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param key {String}
    */
    removeItem: function(promise, key) {
      var cardTypeName = this.sandbox.card.manifest.name;
      $.ajax({
        url: '/api/pane_type_user_entries/' + encodeURIComponent(cardTypeName) + '.json',
        type: 'DELETE',
        data: {key: key, access: 'private'}
      }).then(function(r) {
        promise.resolve(r);
      }, function(r) {
        promise.reject(r);
      });
    }
  }
});

export default PaneTypeUserStorageService;
