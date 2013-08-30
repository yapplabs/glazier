function ajax(url, options){
  return Ember.RSVP.Promise(function(resolve, reject){
    options.success = function(data) {
      Ember.run(null, resolve, data);
    };

    options.error = function(jqXHR, textStatus, errorThrown) {
      // Construct a serialization-friendly error object
      //   This value should survive the postMessage transport used to communicate to/from cards
      var error = {
        type: textStatus,
        status: jqXHR.status,
        responseText: jqXHR.responseText,
        headers: jqXHR.getAllResponseHeaders()
      };
      Ember.run(null, reject, error);
    };

    $.ajax(url, options);
  });
}

export default ajax;
