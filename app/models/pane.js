var Pane = DS.Model.extend({
  cardManifest: DS.belongsTo('Glazier.CardManifest'),
  capabilityProviders: DS.hasMany('Glazier.CapabilityProvider') // cards that provide services to this card
});

export = Pane;
