import 'card' as card;
import 'conductor' as Conductor;

var Stargazers = {
  findByRepositoryName: function(repositoryName) {
    return card.consumers.unauthenticatedGithubApi.request("ajax", {
      url: '/repos/' + repositoryName + '/stargazers',
      dataType: 'json'
    });
  }
};

var Repo = {
  getCurrentRepositoryName: function(){
    return Ember.RSVP.resolve(card.consumers.repository.request('getRepository'));
  }
};


function retrieveStargazers(route) {
  var applicationController = route.controllerFor('application');

  return Repo.getCurrentRepositoryName().then(function(repositoryName) {
    applicationController.set('repositoryName', repositoryName);
    return Stargazers.findByRepositoryName(repositoryName);
  }).then(null, Conductor.error);
}

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function(user) {
      retrieveStargazers(this);
    }
  },
  model: function(){
    return retrieveStargazers(this);
  }
});

export = ApplicationRoute;
