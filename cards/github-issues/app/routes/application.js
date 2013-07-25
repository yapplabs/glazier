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
    currentUserChanged: function() {
      var route = this;
      var applicationController = route.controllerFor('application');
      var repositoryName = card.data.repositoryName;
      var user = card.data.user;

      if (!user) {
        applicationController.set('myIssues', []);
        return;
      }

      Issue.
        findByUserAndRepositoryName(repositoryName, user).
          then(updateTheApplicationController).
          then(null, Conductor.error);

      function updateTheApplicationController(hash) {
        applicationController.set('myIssues', hash.userIssues);
        applicationController.set('model', hash.allIssues);

        return hash;
      }
    }
  },

  model: function(){
    var applicationController = this.controllerFor('application');

    var repositoryName = card.data.repositoryName;

    applicationController.set('repositoryName', repositoryName);

    var route = this;

    var user = card.data.user;

    function handleRejection(reason) {
      if (Issue.isErrorDueToIssuesBeingDisabled(reason)) {
        route.transitionTo('disabled')
      } else {
        throw reason;
      }
    }

    function process(hash) {
      applicationController.set('myIssues', hash.userIssues);
      return hash.allIssues;
    }

    return Issue.findByUserAndRepositoryName(repositoryName, user).
      then(process, handleRejection);
  }
});

export default ApplicationRoute;
