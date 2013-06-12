var CapabilityProvider = DS.Model.extend({
  capability: DS.attr('string'),
  provider: DS.belongsTo('Glazier.Pane')
});

export = CapabilityProvider;
