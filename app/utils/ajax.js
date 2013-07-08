function ajax(url, options){
  return Ember.RSVP.Promise(function(resolve, reject){
    options.success = function(data) {
      Ember.run(null, resolve, data);
    };

    options.error = function() {
      Ember.run(null, reject, arguments);
    };

    $.ajax(url, options);
  });
}

export default ajax;
