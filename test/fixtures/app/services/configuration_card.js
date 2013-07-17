var card = Conductor.card({
  consumers: {
    configuration: Conductor.Oasis.Consumer.extend({})
  },
  metadata: {
    retrievedConfig: function() {
      var service = this.consumers.configuration;
      return service.request('configurationValue', 'config_test');
    }
  }
});
