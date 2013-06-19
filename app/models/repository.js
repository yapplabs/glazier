var promises = {};

var Repository = {
  find: function (id) {
    var promise = promises[id];

    if (promise) {
      return promise;
    }

    promise = new Ember.RSVP.Promise(function(resolve, reject) {
      function success(json) {
        Ember.run(null, resolve, json);
      }

      function error(jqXHR, textStatus, errorThrown) {
        Ember.run(null, reject, jqXHR);
      }

      Ember.$.ajax({
        type: 'get',
        url: 'https://api.github.com/repos/' + id,
        dataType: 'json',
        success: success,
        error: error
      });
    });

    promises[id] = promise;

    return promise;
  }
};

export = Repository;
