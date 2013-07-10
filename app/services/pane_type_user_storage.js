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
      var data = {};
      data[key] = value;
      $.ajax({
        url: '/api/pane_type_user_entries/' + encodeURIComponent(this.sandbox.data.cardType) + '.json',
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
      $.ajax({
        url: '/api/pane_type_user_entries/' + encodeURIComponent(this.sandbox.data.cardType) + '.json',
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
