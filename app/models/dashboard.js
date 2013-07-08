var Dashboard = DS.Model.extend({
  panes: DS.hasMany('Glazier.Pane')
});

export default Dashboard;
