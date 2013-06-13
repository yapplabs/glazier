import 'card' as card;

var Issues = {
  findByRepositoryName: function(repositoryName) {
    return card.consumers.unauthenticatedGithubApi.request("ajax", {
      url: '/repos/' + repositoryName + '/issues',
      dataType: 'json'
    });
  }
};

var Repo = {
  getCurrentRepositoryName: function(){
    return Ember.RSVP.resolve(card.consumers.repository.request('getRepository'));
  }
};


function retrieveIssues(route) {
  var applicationController = route.controllerFor('application');

  return Repo.getCurrentRepositoryName().then(function(repositoryName) {
    applicationController.set('repositoryName', repositoryName);

    return Issues.findByRepositoryName(repositoryName).then(function(issues){
      applicationController.set('model', issues);
    });

  }).then(null, Conductor.error);
}

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function(user) {
      retrieveIssues(this);
    }
  },
  model: function(){
    return retrieveIssues(this);
  }
});

export = ApplicationRoute;
