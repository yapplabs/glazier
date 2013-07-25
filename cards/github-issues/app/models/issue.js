import card from 'card';

var Issue = {
  /*
    @public

    Fetches and aggregates all issues for a given repo and user

    @method  findEverything
    @param  repositoryName {String}
    @param  githubLoigin {String}
    @returns {Ember.RSVP.Promise}
  */
  findEverything: function(repositoryName, githubLogin){
    var hash = {};

    hash.allIssues = Issue.findAllByRepositoryName(repositoryName);
    hash.userIssues = githubLogin && Issue.findByRepositoryNameAndGithubLogin(repositoryName, githubLogin);

    return Ember.RSVP.hash(hash);
  },
  /*
    @public

    Fetches all issues given a repository name.

    @method findAllByRepositoryName
    @param  repositoryName {String}
    @returns {Ember.RSVP.Promise}
  */
  findAllByRepositoryName: function(repositoryName) {
    var service;

    if (card.data.user) {
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

    @method findByRepositoryNameAndGithubLogin
    @param  repositoryName {String}
    @param  githubLogin {String}
    @returns {Ember.RSVP.Promise}
  */
  findByRepositoryNameAndGithubLogin: function(repositoryName, githubLogin) {
    return card.consumers.authenticatedGithubApi.request("ajax", {
      url: '/repos/' + repositoryName + '/issues?creator=' + githubLogin,
      dataType: 'json'
    });
  },

  /*
    @public

    Given an error, will reason if it is due to the issues
    being disabled or not.

    @method isErrorDueToIssuesBeingDisabled
    @param  error {Error}
    @returns {Boolean}
  */
  isErrorDueToIssuesBeingDisabled: function(error) {
    if (error.status !== 410) {
      return false;
    }
    try {
      var responseData = JSON.parse(error.responseText);
      if (responseData.message === 'Issues are disabled for this repo') {
        return true;
      }
    } catch(e) {}
    return false;
  }
};

export default Issue;
