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
  position: DS.attr('number'),
  containerType: DS.attr('string'),
  panes: DS.hasMany('pane'),
  dashboard: DS.belongsTo('dashboard'),
  reorderPanes: function(orderedPaneIds) {
    var panes = this.get('panes').toArray();
    panes.forEach(function(pane){
      var newPosition = orderedPaneIds.indexOf(pane.get('id'));
      pane.set('position', newPosition);
    });
    this.store.adapterFor(Glazier.Pane).persistPanePositions(panes);
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
  }.property('panes.@each'),
  updateSlug: function(){
    this.set('slug', Section.sluggerize(this.get('name')));
  }.observes('name')
});

Section.reopenClass({
  sluggerize: function(name) {
    return name.dasherize().replace(/[^a-z0-9-]/g, '');
  }
});
export default Section;
