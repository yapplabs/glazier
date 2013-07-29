import Conductor from 'conductor';
import Repository from 'glazier/models/repository';
import Dashboard from 'glazier/models/dashboard';

var DashboardRoute = Ember.Route.extend({
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
    // We check if the repo exists before hitting the server
    // since we need to do this for the sidebar and this
    // saves the server from having to repeat it
    return Repository.find(id, accessToken).then(function (repository) {
      return Glazier.Dashboard.find(id).then(function(dashboard){
        dashboard.set('repository', repository);
        return dashboard;
      });
    });
  },
  afterModel: function (resolvedModel) {
    // If we routed to this providing the dashboard as context
    // then the model hook isn't run, we need to ensure the
    // repository is there
    if (resolvedModel.get('repository')) {
      return;
    }
    var id = resolvedModel.get('id'),
        accessToken = this.controllerFor('user').get('accessToken');
    return Repository.find(id, accessToken).then(function (repository) {
      resolvedModel.set('repository', repository);
    });
  },
  events: {
    error: function (error) {

      var responseText = JSON.parse(error.responseText);

      if (error.status === 404) {
        this.transitionTo('notFound');
        this.controllerFor('notFound').set('content', responseText.message);
      } else if (error.status === 403 &&
                 error.getResponseHeader('X-RateLimit-Remaining') === '0') {
        var reset = new Date(parseInt(error.getResponseHeader('X-RateLimit-Reset'),10)*1000);
        this.controllerFor('rateLimitExceeded').set('reset', reset);
        this.transitionTo('rateLimitExceeded');
      } else {
        Ember.Logger.error(error);

        this.controllerFor('error').set('content', responseText.message);
        this.transitionTo('error');
      }
    },
    reorderedPanes: function(){
      this.send('hideModal');
      this.controller.propertyWillChange('panes');
      this.controller.propertyDidChange('panes');
    }
  }
});

export default DashboardRoute;
