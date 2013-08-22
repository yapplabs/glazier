import Conductor from 'conductor';

var IntentService = Conductor.Oasis.Service.extend({
  target: null, // injected
  events: {
    triggerIntent: function(intent) {
      this.target.send('handleIntent', intent);
    }
  }
});

export default IntentService;
