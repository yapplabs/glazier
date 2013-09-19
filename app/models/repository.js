import ajax from 'glazier/utils/ajax';

var promises = {};
var Repository = {
  find: function (id, accessToken) {
    var promise = promises[id];

    if (promise) {
      return promise;
    }

    promise = ajax('https://api.github.com/repos/' + id, {
      type: 'get',
      dataType: 'jsonp',
      beforeSend: function(xhr) {
        if (accessToken) {
          xhr.setRequestHeader('Authorization', "token " + accessToken);
        }
      }
    });

    promises[id] = promise;

    return promise;
  }
};

export default Repository;
