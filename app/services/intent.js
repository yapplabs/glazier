import Conductor from 'conductor';

var IntentService = Conductor.Oasis.Service.extend({
  dashboardController: null, // injected
  events: {
    triggerIntent: function(intent) {
      this.dashboardController.send('handleIntent', intent);
    }
  }
});

export default IntentService;
