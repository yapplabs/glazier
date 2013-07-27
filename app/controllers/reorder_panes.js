import Pane from 'glazier/models/pane';

var ReorderPanesController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  content: Ember.computed.alias('controllers.dashboard.content'),
  applyNewOrder: function(orderedIds){
    this.get('content').reorderPanes(orderedIds);
    this.send('reorderedPanes');
  }
});
export default ReorderPanesController;
