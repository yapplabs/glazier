import Pane from 'glazier/models/pane';

var ReorderPanesController = Ember.ObjectController.extend({
  needs: ['dashboard/section'],
  content: Ember.computed.alias('controllers.dashboard/section.content'),
  orderablePanes: function(){
    var panes = this.get('panes');
    if (panes) { // hack... in this case we should probably not be observing anymore
      return panes.filterProperty('paneType.hasUI');
    }
  }.property('panes.[]'),
  actions: {
    applyNewOrder: function(orderedIds){
      // Give the UI a chance to clear panes...
      this.send('willReorderPanes');
      Ember.run.schedule('afterRender', this, function(){
        this.get('content').reorderPanes(orderedIds);
        // ... and now recreate them in the new order
        this.send('didReorderPanes');
      });
    }
  }
});
export default ReorderPanesController;
