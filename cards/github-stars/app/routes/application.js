import 'card' as card;
import 'conductor' as Conductor;

var Stargazers = {
  getApiConsumer: function(user){
    return user ? card.consumers.authenticatedGithubApi : card.consumers.unauthenticatedGithubApi;
  },
  findByRepositoryName: function(repositoryName, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    return apiConsumer.request("ajax", {
      url: '/repos/' + repositoryName + '/stargazers?sort=updated',
      dataType: 'json'
    });
  },
  currentUserStarred: function(repositoryName, user) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!user) {
        resolve(false);
      }
      var apiConsumer = Stargazers.getApiConsumer(user);
      return apiConsumer.request("ajax", {
        url: '/user/starred/' + repositoryName,
        type: 'GET',
        dataType: 'json'
      }).then(function () {
        resolve(true);
      }, function (e) {
        return e.status == 404 ? resolve(false) : reject(e);
      });
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
    return Ember.RSVP.all([
      Stargazers.findByRepositoryName(repositoryName, user),
      Stargazers.currentUserStarred(repositoryName, user)
    ]).then(function (allResults) {
      return {
        repositoryName: repositoryName,
        stargazers: allResults[0],
        isStarred: allResults[1]
      };
    });
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
      var controller = this.controller;
      Stargazers.starRepository(repository, user).then(function(){
        controller.set('isStarred', true);
      });
    },
    unstar: function(){
      var repository = this.controller.get('repositoryName');
      var user = this.controllerFor('user').get('content');
      var controller = this.controller;
      Stargazers.unstarRepository(repository, user).then(function(){
        controller.set('isStarred', false);
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
