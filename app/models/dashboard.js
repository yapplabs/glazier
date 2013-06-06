var Dashboard = DS.Model.extend({
  cards: DS.hasMany('Glazier.Pane')
});

export Dashboard;
