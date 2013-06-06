var RepositoryService = Conductor.Oasis.Service.extend({
  requests: {
    getRepository: function(promise) {
      // TODO: not this
      var repoId = Glazier.__container__.lookup("controller:dashboard").get('id');
      promise.resolve(repoId);
    }
  }
});

export RepositoryService;
