var Pane = DS.Model.extend({
  paneType: DS.belongsTo('Glazier.PaneType'),
  capabilityProviders: DS.hasMany('Glazier.CapabilityProvider'), // cards that provide services to this card

  paneEntries: DS.attr('passthrough'),
  paneUserEntries: DS.attr('passthrough'),
  paneTypeUserEntries: DS.attr('passthrough'),
  cardData: function() {
    return {
      paneEntries: this.get('paneEntries') || {},
      paneUserEntries: this.get('paneUserEntries') || {},
      paneTypeUserEntries: this.get('paneTypeUserEntries') || {}
    };
  }.property('paneEntries', 'paneUserEntries', 'paneTypeUserEntries')
});

export default Pane;
