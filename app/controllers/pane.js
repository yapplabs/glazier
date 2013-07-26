var PaneController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  isAdmin: Ember.computed.alias('controllers.dashboard.isAdmin'),
  isHidden: false,
  card: null,
});

export default PaneController;
