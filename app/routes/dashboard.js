import 'conductor' as Conductor;
import 'glazier/models/repository' as Repository;

var DashboardRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);

    var id = model.get("id");
    var repositorySidebarController = this.controllerFor('repositorySidebar');
    repositorySidebarController.setCurrentRepository(model.get('repository'));
  },
  serialize: function (model, params) {
    var parts = model.id.split('/'),
        hash = {};

    Ember.assert(parts.length === 2 && params.length === 2, 'parts should equal params');

    hash[params[0]] = parts[0];
    hash[params[1]] = parts[1];

    return hash;
  },
  model: function (params) {
    var id = params.github_user + '/' + params.github_repo,
        accessToken = this.controllerFor('user').get('accessToken');
    return Repository.find(id, accessToken).then(function (repository) {
      return Glazier.Dashboard.find(id).then(function(dashboard){
        dashboard.set('repository', repository);
        return dashboard;
      });
    });
  },
  events: {
    error: function (error) {

      var responseText = JSON.parse(error.responseText);

      if (error.status === 404) {
        this.transitionTo('notFound');
        this.controllerFor('notFound').set('content', responseText.message);
      } else {
        Ember.Logger.error(error);

        this.controllerFor('error').set('content', responseText.message);
        this.transitionTo('error');
      }
    }
  }
});

export = DashboardRoute;
