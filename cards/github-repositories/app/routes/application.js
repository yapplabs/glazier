import 'card' as card;

var ApplicationRoute = Ember.Route.extend({
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
