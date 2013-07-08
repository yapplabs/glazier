var FooterController = Ember.Controller.extend({
  isDrawerOpen: false,
  toggleAnalyticsDrawer: function(){
    this.toggleProperty('isDrawerOpen');
  }
});

export default FooterController;
