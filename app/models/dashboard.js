var Dashboard = DS.Model.extend({
  sections: DS.hasMany('Glazier.Section')
});

export default Dashboard;
