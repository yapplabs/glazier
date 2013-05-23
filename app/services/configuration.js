var ConfigurationService = Conductor.Oasis.Service.extend({
  requests: {
    configurationValue: function(promise, key) {
      var result = Ember.$('meta[name='+ key + ']').attr('content');
      promise.resolve(result);
    }
  }
});

export ConfigurationService;