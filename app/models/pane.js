var Pane = DS.Model.extend({
  type: DS.belongsTo('Glazier.CardType'),
  capabilityProviders: DS.hasMany('Glazier.CapabilityProvider') // cards that provide services to this card
});

export Pane;

