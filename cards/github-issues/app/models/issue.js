import card from 'card';

var Issue = {
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

export default Issue;
