import card from 'card';
import Conductor from 'conductor';
import Issue from 'app/models/issue';
import Repo from 'app/models/repo';

function fetch() {
  return Ember.RSVP.hash({
    user: card.consumers.identity.getCurrentUser(),
    repositoryName: Repo.getCurrentRepositoryName()
  }).then(function(hash){
    var repositoryName = hash.repositoryName;
    var user = hash.user;

    hash.allIssues = Issue.findAllByRepositoryName(repositoryName, user);
    hash.userIssues = user && Issue.findByUserAndRepositoryName(repositoryName, user.github_login);

    return Ember.RSVP.hash(hash);
  });
}

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function(user) {
      var route = this;
      var applicationController = route.controllerFor('application');

      fetch().then(function(hash){
        applicationController.set('myIssues', hash.userIssues);
        applicationController.set('model', hash.allIssues);

      }).then(null, Conductor.error);
    }
  },

  model: function(){
    var applicationController = this.controllerFor('application');

    return fetch().then(function(hash) {
      applicationController.set('repositoryName', hash.repositoryName);
      applicationController.set('myIssues', hash.userIssues);

      return hash.allIssues;
    });
  }
});

export default ApplicationRoute;
