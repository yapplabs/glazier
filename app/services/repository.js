var RepositoryService = Conductor.Oasis.Service.extend({
  requests: {
    getRepository: function(promise) {
      var repoId = this.container.lookup('controller:dashboard').get('id');
      promise.resolve(repoId);
    }
  }
});

export RepositoryService;
