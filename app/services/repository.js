import Conductor from 'conductor';

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
    getRepository: function() {
      return this.container.lookup('controller:dashboard').get('id');
    }
  }
});

export default RepositoryService;
