import card from 'card';
import Conductor from 'conductor';
import Issue from 'app/models/issue';

function fetch() {
  var repositoryName = card.data.repositoryName;
  var user = card.data.user;

  var hash = {};
  hash.allIssues = Issue.findAllByRepositoryName(repositoryName);
  hash.userIssues = user && Issue.findByUserAndRepositoryName(repositoryName, user.github_login);

  return Ember.RSVP.hash(hash);
}

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function() {
      var route = this;
      var applicationController = route.controllerFor('application');

      if (!card.data.user) {
        applicationController.set('myIssues', []);
        return;
      }

      fetch().then(function(hash){
        applicationController.set('myIssues', hash.userIssues);
        applicationController.set('model', hash.allIssues);

      }).then(null, Conductor.error);
    }
  },

  model: function(){
    var applicationController = this.controllerFor('application');
    applicationController.set('repositoryName', card.data.repositoryName);

    return fetch().then(function(hash) {
      applicationController.set('myIssues', hash.userIssues);
      return hash.allIssues;
    });
  }
});

export default ApplicationRoute;
