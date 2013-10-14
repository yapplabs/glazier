var DashboardIndexRoute = Ember.Route.extend({
  beforeModel: function(){
    var dashboard = this.modelFor('dashboard'),
        route = this;
    return dashboard.get('sections').then(function(sections){
      route.transitionTo('dashboard.section', dashboard, sections.get('firstObject'));
    });
  }
});

export default DashboardIndexRoute;
