import Conductor from 'conductor';

var MetadataUpdateService = Conductor.Oasis.Service.extend({
  initialize: function(port) {
    this.sandbox.metadataUpdatePort = port;
  },
  events: {
    updateMetadata: function(params) {
      if (this.port.trigger) {
        this.port.trigger('updatedData', params.bucket, params.data);
      }
    }
  },
  destroy: function(){
    this.port.trigger = null;
  }
});

export default MetadataUpdateService;
