import 'conductor' as Conductor;

var UserStorageService = Conductor.Oasis.Service.extend({

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
        url: '/api/cards/' + this.sandbox.card.id + '/user.json',
        type: 'POST',
        data: {data: data, access: 'private'}
      }).then(function(r){
        promise.resolve(r);
      }, function(r){
        promise.reject(r);
      });
    },

    /*
      @public

      @method getItem
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param key {String}
    */
    getItem: function(promise, key) {
      $.ajax({
        url: '/api/cards/' + this.sandbox.card.id + '.json',
        type: 'GET',
        dataType: 'json'
      }).then(function(r) {
        promise.resolve(r.card.private[key]);
      }, function(r) {
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
        url: '/api/cards/' + this.sandbox.card.id + '/user.json',
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

export = UserStorageService;
