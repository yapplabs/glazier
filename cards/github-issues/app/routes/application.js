import 'card' as card;

var Issue = {
  /*
    @public

    Fetches all issues given a repository name.

    @method findAllByRepositoryName
    @param  repositoryName {String}
    @returns {Ember.RSVP.Promise}
  */
  findAllByRepositoryName: function(repositoryName, user) {
    var service;
    if (user) {
      service = card.consumers.authenticatedGithubApi;
    } else {
      service = card.consumers.unauthenticatedGithubApi;
    }
    return service.request("ajax", {
      url: '/repos/' + repositoryName + '/issues',
      dataType: 'json'
    });
  },

  /*
    @public

    Fetches the current issues given a repository name.

    @method findMineByRepositoryName
    @param  repositoryName {String}
    @returns {Ember.RSVP.Promise}
  */
  findByUserAndRepositoryName: function(repositoryName, creator) {
    return card.consumers.authenticatedGithubApi.request("ajax", {
      url: '/repos/' + repositoryName + '/issues?creator=' + creator,
      dataType: 'json'
    });
  }
};

var Repo = {
  /*
    @public

    Retrieves the current repository name.

    @method getCurrentRepositoryName
    @returns {Ember.RSVP.Promise}
  */
  getCurrentRepositoryName: function(){
    return Ember.RSVP.resolve(card.consumers.repository.request('getRepository'));
  }
};

function fetch() {
  return Ember.RSVP.hash({
    user: card.consumers.identity.getCurrentUser(),
    repositoryName: Repo.getCurrentRepositoryName()
  }).then(function(hash){
    var repositoryName = hash.repositoryName;
    var user = hash.user;

    hash.allIssues = Issue.findAllByRepositoryName(repositoryName, user);
    hash.usersIssues = user && Issue.findByUserAndRepositoryName(repositoryName, user.github_login);

    return Ember.RSVP.hash(hash);
  });
}

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function(user) {
      var route = this;
      var applicationController = route.controllerFor('application');

      fetch().then(function(hash){
        if (hash.usersIssues) {
          applicationController.set('myIssues', hash.userIssues);
        }

        applicationController.set('model', hash.allIssues);
      }).then(null, Conductor.error);
    }
  },

  model: function(){
    var applicationController = this.controllerFor('application');

    return fetch().then(function(hash) {
      applicationController.set('repositoryName', hash.repositoryName);

      if (hash.usersIssues) {
        applicationController.set('myIssues', hash.userIssues);
      }

      return hash.allIssues;
    });
  }
});

export = ApplicationRoute;
