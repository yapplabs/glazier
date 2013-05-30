var UserStorageService = Conductor.Oasis.Service.extend({
  requests: {
    setItem: function(promise, key, value) {
      var data = {};
      data[key] = value;
      $.ajax({
        url: '/api/cards/' + this.sandbox.card.id + '/user.json',
        type: 'POST',
        data: {data: data, access: 'private'}
      }).then(function(r){ promise.resolve(r); }, function(r){ promise.reject(r); });
    },
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
    }
  }
});

export UserStorageService;
