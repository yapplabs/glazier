import 'card' as card;
import 'conductor' as Conductor;

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

    var repositoryService = card.consumers['repository'];
    var currentRepoRequest = repositoryService.request('getRepository');

    currentRepoRequest.then(function(repoName) {
      controller.set('currentRepository', repoName);
    }).then(null, Conductor.error);
  },

  model: function(){
    return card.consumers.authenticatedGithubApi.getRepositories();
  }
});

export = ApplicationRoute;
