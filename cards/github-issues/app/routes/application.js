import 'card' as card;

var resolve = Ember.RSVP.resolve;

var Issues = {
  findByRepoName: function(repoName) {
    return card.consumers.unauthenticatedGithubApi.request("ajax", {
      url: '/repos/' + repoName + '/issues',
      dataType: 'json'
    });
  }
};

var ApplicationRoute = Ember.Route.extend({
  model: function(){
    var route = this,
    applicationController = this.controllerFor('application');

    return resolve(card.consumers.repository.request('getRepository')).then(function(repoName){

      Ember.run(applicationController, 'set', 'repositoryName', repoName);

      return Issues.findByRepoName(repoName);
    });
  }
});

export = ApplicationRoute;
