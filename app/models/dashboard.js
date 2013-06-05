var Dashboard = DS.Model.extend({
  cards: DS.hasMany('Glazier.Card')
});

export Dashboard;
