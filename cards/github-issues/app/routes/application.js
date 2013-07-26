import card from 'card';
import Conductor from 'conductor';
import Issue from 'app/models/issue';

var ApplicationRoute = Ember.Route.extend({
  redirect: function(){
    var applicationController = this.controllerFor('application');

    if (applicationController.get('isDisabled')) {
      this.transitionTo('disabled');
    }
  },
  events: {
    currentUserChanged: function(user) {
      var route = this;
      var applicationController = route.controllerFor('application');
      var repositoryName = card.data.repositoryName;
      var githubLogin = user && user.github_login;

      if (!user) {
        applicationController.set('myIssues', []);
        return;
      }

      Issue.
        findEverything(repositoryName, githubLogin).
          then(updateTheApplicationController).
          then(null, Conductor.error);

      function updateTheApplicationController(hash) {
        applicationController.set('myIssues', hash.userIssues || []);
        applicationController.set('model', hash.allIssues);

        return hash;
      }
    }
  },

  model: function(){
    var route = this;
    var user = card.data.user;
    var githubLogin = user && user.github_login;
    var applicationController = this.controllerFor('application');
    var repositoryName = card.data.repositoryName;

    applicationController.set('repositoryName', repositoryName);

    function handleRejection(reason) {
      if (Issue.isErrorDueToIssuesBeingDisabled(reason)) {
        route.transitionTo('disabled');
      } else {
        throw reason;
      }
    }

    function process(hash) {
      applicationController.set('myIssues', hash.userIssues || []);
      return hash.allIssues;
    }

    return Issue.findEverything(repositoryName, githubLogin).
                   then(process, handleRejection);
  }
});

export default ApplicationRoute;
