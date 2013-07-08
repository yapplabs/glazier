var RepositoryController = Ember.Controller.extend({
  needs: ['dashboard'],
  path: Ember.computed.alias('controllers.dashboard.id')
});

export default RepositoryController;
