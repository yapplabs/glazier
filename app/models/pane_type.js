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
  }.property('manifest')

});

export default PaneType;
