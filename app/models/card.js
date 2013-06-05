var Card = DS.Model.extend({
  cardType: DS.belongsTo('Glazier.CardType'),
  consumes: DS.hasMany('Glazier.Card') // cards that provide services to this card
});

export Card;
