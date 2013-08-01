var maxProperty = function(array, property) {
  var max = array.objectAt(0);
  array.forEach(function(o){
    if (o.get(property) > max.get(property)) {
      max = o;
    }
  });
  return max;
};

var maxValue = function(array, property){
  if (Ember.isEmpty(array)) {
    return null;
  }
  return maxProperty(array, property).get(property);
};

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
  },
  nextPanePosition: function(){
    var max = maxValue(this.get('panes'), 'position') || 0;
    return max + 1;
  }.property().volatile()
});

export default Dashboard;
