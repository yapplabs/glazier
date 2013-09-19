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
        accessToken = this.controllerFor('user').get('accessToken'),
        store = this.store;

    // We check if the repo exists before hitting the server
    // since we need to do this for the sidebar and this
    // saves the server from having to repeat it
    return Repository.find(id, accessToken).then(function (repository) {
      var promise, dashboard = store.find('dashboard', id);
      if (dashboard.get('isLoaded')) {
        promise = dashboard.reload();
      } else {
        promise = dashboard;
      }

      return promise.then(function(dashboard){
        dashboard.set('repository', repository.data);
        return dashboard;
      });
    });
  },
  afterModel: function (dashboard, transition) {
    // Pre-load paneTypes for intent handling.
    this.controllerFor('paneTypes').get('content');

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
  setupController: function(controller, model) {
    this._super(controller, model);
    this.controllerFor('section_navigation').set('content', model.get('sections'));
  },
  actions: {
    error: function (error, transition) {

      var responseText = JSON.parse(error.responseText);

      if (error.status === 404) {
        this.transitionTo('notFound');
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
    navigateToSection: function(section) {
      var dashboard = this.currentModel;
      if (this.modelFor('dashboard/section') !== section) {
        this.transitionTo('dashboard.section', dashboard, section);
      }
    },
    sectionRemoved: function(section, oldIndex) {
      var sections = this.modelFor('dashboard').get('sections');
      if (section === this.modelFor('dashboard/section') && sections.get('length') > 0) {
        var newIndex = Math.max(oldIndex - 1, 0);
        var sectionToSelect = sections.objectAt(newIndex);
        this.send('navigateToSection', sectionToSelect);
      }
    }
  }
});

export default DashboardRoute;
