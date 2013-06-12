var ConfigurationService = Conductor.Oasis.Service.extend({

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method configurationValue
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param key {String}
    */
    configurationValue: function(promise, key) {
      var result = Ember.$('meta[name='+ key + ']').attr('content');
      promise.resolve(result);
    }
  }
});

export = ConfigurationService;
