var FooterController = Ember.Controller.extend({
  isDrawerOpen: false,
  actions: {
    toggleAnalyticsDrawer: function(){
      this.toggleProperty('isDrawerOpen');
    }
  }
});

export default FooterController;
