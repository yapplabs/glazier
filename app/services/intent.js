import Conductor from 'conductor';

var IntentService = Conductor.Oasis.Service.extend({
  events: {
    triggerIntent: function(intent) {
      var intentsController = this.container.lookup('controller:intents');
      intentsController.send('handleIntent', intent);
    }
  }
});

export default IntentService;
