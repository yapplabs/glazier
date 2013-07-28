var Dashboard = DS.Model.extend({
  panes: DS.hasMany('Glazier.Pane'),
  reorderPanes: function(orderedPaneIds) {
    var transaction = this.get('store').transaction();
    this.get('panes').toArray().forEach(function(pane){
      var newPosition = orderedPaneIds.indexOf(pane.get('id'));
      pane.set('position', newPosition);
      transaction.add(pane);
    });
    transaction.commit();
  }
});

export default Dashboard;
