var PaneType = DS.Model.extend({
  manifest: DS.attr('json'),
  hasUI: function() {
    return this.get('manifest.ui') !== false;
  }.property('manifest'),
  isProvider: function() {
    return this.get('manifest.provides.length') > 0;
  }.property('manifest')
});

export default PaneType;
