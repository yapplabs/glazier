var UserStorageService = Conductor.Oasis.Service.extend({
  requests: {
    setItem: function(promise, key, value) {
      var data = {};
      data[key] = value;
      $.ajax({
        url: 'http://foo',
        type: 'POST',
        data: data
      }).then(function(r){ promise.resolve(r); }, function(r){ promise.reject(r); });
    },
    getItem: function(promise, key) {
      $.ajax({
        url: 'http://foo/' + key,
        type: 'GET'
      }).then(function(r){ promise.resolve(r.responseText); }, function(r){ promise.reject(r); });
    }
  }
});

export UserStorageService;
