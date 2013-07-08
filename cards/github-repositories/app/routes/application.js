import card from 'card';
import Conductor from 'conductor';

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function(user) {
      var applicationController = this.controllerFor('application');

      var repos = card.consumers.authenticatedGithubApi.getRepositories();

      repos.then(function(repos){
        applicationController.set('model', repos);
      }).then(null, Conductor.error);
    }
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('currentRepository', card.data.repositoryName);
  },

  model: function(){
    return card.consumers.authenticatedGithubApi.getRepositories();
  }
});

export default ApplicationRoute;
