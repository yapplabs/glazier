var DashboardSectionRoute = Ember.Route.extend({
  serialize: function (model, params) {
    return {section_slug: model.get('slug')};
  },

  model: function(params){
    var section = this.modelFor('dashboard').get('sections').findBy("slug", params.section_slug);
    if (!section) {
      throw new Error("No section found for " + params.section_slug);
    }
    // wait for panes to load
    return section.get('panes').then(function() { return section; });
  },
  actions: {
    error: function(error) {
      this.transitionTo('notFound');
    },
    willReorderPanes: function(){
      this.send('hideModal');
      this.controller.set('isPerformingReorder', true);
    },
    didReorderPanes: function(){
      this.controller.set('isPerformingReorder', false);
    },
    addPane: function(paneType) {
      this.controller.send('addPane', paneType);
    },
    paste: function(pane) {
      this.controller.send('addPane', pane.get('paneType'), pane.get('repository'), pane.get('paneEntries'));
    },
    willTransition: function() {
      this.controller.set('content', null);
    }
  }
});

export default DashboardSectionRoute;
