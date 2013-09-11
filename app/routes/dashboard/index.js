var DashboardIndexRoute = Ember.Route.extend({
  beforeModel: function(){
    var dashboard = this.modelFor('dashboard');
    this.transitionTo('dashboard.section', dashboard, dashboard.get('sections.firstObject'));
  }
});

export default DashboardIndexRoute;
