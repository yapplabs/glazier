var DashboardIndexRoute = Ember.Route.extend({
  beforeModel: function(){
    var dashboard = this.modelFor('dashboard');
    var self = this;
    return dashboard.get('sections').then(function (sections) {
      self.transitionTo('dashboard.section', dashboard, sections.get('firstObject'));
    });
  }
});

export default DashboardIndexRoute;
