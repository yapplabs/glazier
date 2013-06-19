import 'conductor' as Conductor;

var RepositoryService = Conductor.Oasis.Service.extend({

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method getRepository
      @param promise {Conductor.Oasis.RSVP.Promise}
    */
    getRepository: function(promise) {
      var repoId = this.container.lookup('controller:dashboard').get('id');
      promise.resolve(repoId);
    }
  }
});

export = RepositoryService;
