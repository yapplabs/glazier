import 'card' as card;
import 'conductor' as Conductor;

var Stargazers = {
  getApiConsumer: function(user){
    return user ? card.consumers.authenticatedGithubApi : card.consumers.unauthenticatedGithubApi;
  },
  findByRepositoryName: function(repositoryName, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    return apiConsumer.request("ajax", {
      url: '/repos/' + repositoryName + '/stargazers',
      dataType: 'json'
    });
  },
  starRepository: function(repositoryName, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    return apiConsumer.request("ajax", {
      url: '/user/starred/' + repositoryName,
      type: 'PUT',
      dataType: 'json'
    });
  },
  unstarRepository: function(repositoryName, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    return apiConsumer.request("ajax", {
      url: '/user/starred/' + repositoryName,
      type: 'DELETE',
      dataType: 'json'
    });
  }
};

var Repo = {
  getCurrentRepositoryName: function(){
    return Ember.RSVP.resolve(card.consumers.repository.request('getRepository'));
  }
};


function retrieveStargazers(route, user) {
  var applicationController = route.controllerFor('application');

  return Repo.getCurrentRepositoryName().then(function(repositoryName) {
    applicationController.set('repositoryName', repositoryName);
    return Stargazers.findByRepositoryName(repositoryName, user);
  }).then(null, Conductor.error);
}

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function(user) {
      this.controllerFor('user').set('model', user);
      retrieveStargazers(this, user);
    },
    star: function(){
      var repository = this.controller.get('repositoryName');
      var user = this.controllerFor('user').get('content');
      var route = this;
      Stargazers.starRepository(repository, user).then(function(){
        retrieveStargazers(route, user);
      });
    },
    unstar: function(){
      var repository = this.controller.get('repositoryName');
      var user = this.controllerFor('user').get('content');
      var route = this;
      Stargazers.unstarRepository(repository, user).then(function(){
        retrieveStargazers(route, user);
      });
    }
  },
  model: function(){
    var route = this;
    return card.consumers.identity.request("currentUser").then(function(user){
      route.controllerFor('user').set('model', user);
      return retrieveStargazers(route, user);
    });
  }
});

export = ApplicationRoute;
