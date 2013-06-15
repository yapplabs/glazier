var Conductor = requireModule('conductor');

var card = Conductor.card({
  consumers: {
    configuration: Conductor.Oasis.Consumer.extend({})
  },
  metadata: {
    retrievedConfig: function(resolver) {
      var service = this.consumers.configuration;
      service.request('configurationValue', 'config_test').then(function(result){
        resolver.resolve(result);
      }).then(null, resolver.reject);
    }
  }
});
