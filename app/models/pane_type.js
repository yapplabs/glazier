var PaneType = DS.Model.extend({
  manifest: DS.attr('json'),
  hasUI: function() {
    return this.get('manifest.ui') !== false;
  }.property('manifest'),
  isProvider: function() {
    return this.get('manifest.provides.length') > 0;
  }.property('manifest'),
  displayName: function(){
    var name = this.get('manifest.displayName');
    if (Ember.isEmpty(name)){
      name = this.get('manifest.name');
    }
    return name;
  }.property('manifest'),
  panesOfThisType: function(){
    var thisPaneType = this;
    return this.get('store').filter('pane', function(pane){
      return pane.get('paneType') === thisPaneType;
    });
  }.property(),
  updateUserEntry: function(key, value){
    this.get('panesOfThisType').forEach(function(pane){
      pane.updatePaneTypeUserEntry(key, value);
    });
  },
  removeUserEntry: function(key){
    this.get('panesOfThisType').forEach(function(pane){
      pane.removePaneTypeUserEntry(key);
    });
  }
});

export default PaneType;
