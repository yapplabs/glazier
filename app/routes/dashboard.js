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
      var promise, dashboard = Glazier.Dashboard.find(id);
      if (dashboard.get('isLoaded')) {
        promise = dashboard.reload();
      } else {
        promise = Glazier.Dashboard.find(id);
      }

      return promise.then(function(dashboard){
        dashboard.set('repository', repository);
        return dashboard;
      });
    });
  },
  afterModel: function (dashboard, transition) {
    if (transition.providedModels.dashboard === dashboard) {
      if (dashboard.get('isLoaded')) {
        var self = this;
        return dashboard.reload().then(function() {
          if (dashboard.get('repository')) {
            return;
          }
          var id = dashboard.get('id'),
              accessToken = self.controllerFor('user').get('accessToken');
          return Repository.find(id, accessToken).then(function (repository) {
            dashboard.set('repository', repository);
          });
        });
      }
    }
  },
  events: {
    error: function (error, transition) {

      var responseText = JSON.parse(error.responseText);

      if (error.status === 404) {
        this.transitionTo('notFound');
        this.controllerFor('notFound').set('content', responseText.message);
      } else if (error.status === 403 &&
                 error.getResponseHeader('X-RateLimit-Remaining') === '0') {
        var reset = new Date(parseInt(error.getResponseHeader('X-RateLimit-Reset'),10)*1000);
        this.controllerFor('rateLimitExceeded').setProperties({
          reset: reset,
          previousTransition: transition
        });
        this.transitionTo('rateLimitExceeded');
      } else {
        Ember.Logger.error(error);

        this.controllerFor('error').set('content', responseText.message);
        this.transitionTo('error');
      }
    },
    willTransition: function() {
      this.controller.set('content', null);
    },
    reorderedPanes: function(){
      this.send('hideModal');
      this.controller.propertyWillChange('panes');
      this.controller.propertyDidChange('panes');
    }
  }
});

export default DashboardRoute;
