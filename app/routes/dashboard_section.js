import Conductor from 'conductor';

var DashboardSectionRoute = Ember.Route.extend({
  model: function(){
    return this.modelFor('dashboard').get('sections.firstObject');
  },
  actions: {
    willReorderPanes: function(){
      this.send('hideModal');
      this.controller.set('isPerformingReorder', true);
    },
    didReorderPanes: function(){
      this.controller.set('isPerformingReorder', false);
    },
    addPane: function(paneType) {
      this.controller.send('addPane', paneType);
    },
    paste: function(pane) {
      this.controller.send('addPane', pane.get('paneType'), pane.get('repository'), pane.get('paneEntries'));
    }
  }
});

export default DashboardSectionRoute;
