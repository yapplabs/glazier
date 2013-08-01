var Pane = DS.Model.extend({
  paneType: DS.belongsTo('Glazier.PaneType'),
  dashboard: DS.belongsTo('Glazier.Dashboard'),
  position: DS.attr('number'),

  paneEntries: DS.attr('passthrough'),
  paneUserEntries: DS.attr('passthrough'),
  paneTypeUserEntries: DS.attr('passthrough'),
  cardData: function() {
    return {
      paneEntries: this.get('paneEntries') || {},
      paneUserEntries: this.get('paneUserEntries') || {},
      paneTypeUserEntries: this.get('paneTypeUserEntries') || {}
    };
  }.property('paneEntries', 'paneUserEntries', 'paneTypeUserEntries'),

  manifest: Ember.computed.alias('paneType.manifest'),
  displayName: Ember.computed.alias('paneType.displayName')
});

export default Pane;
