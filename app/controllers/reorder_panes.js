import Pane from 'glazier/models/pane';

var ReorderPanesController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  content: Ember.computed.alias('controllers.dashboard.content'),
  applyNewOrder: function(orderedIds){
    // Give the UI a chance to clear panes...
    this.send('willReorderPanes');
    Ember.run.schedule('afterRender', this, function(){
      this.get('content').reorderPanes(orderedIds);
      // ... and now recreate them in the new order
      this.send('didReorderPanes');
    });
  },
  orderablePanes: function(){
    return this.get('panes').filterProperty('paneType.hasUI');
  }.property('panes.[]')
});
export default ReorderPanesController;
