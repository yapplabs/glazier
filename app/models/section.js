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

var Section = DS.Model.extend({
  name: DS.attr('string'),
  slug: DS.attr('string'),
  containerType: DS.attr('string'),
  panes: DS.hasMany('Glazier.Pane'),
  dashboard: DS.belongsTo('Glazier.Dashboard'),
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
  }.property().volatile(),
  providedCapabilities: function() {
    var capabilities = [];

    var provideLists = this.get('panes').mapProperty('manifest.provides');
    provideLists.forEach(function(list) {
      if (!list) { return; }
      list.forEach(function(provide) {
        capabilities.push(provide);
      });
    });

    return capabilities;
  }.property('panes.@each')
});

export default Section;
