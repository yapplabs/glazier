var RepositoryController = Em.Controller.extend({
  needs: ['dashboard'],
  path: Em.computed.alias('controllers.dashboard.id')
});

export = RepositoryController;
