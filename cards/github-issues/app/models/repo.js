import card from 'card';

var Repo = {
  /*
    @public

    Retrieves the current repository name.

    @method getCurrentRepositoryName
    @returns {Ember.RSVP.Promise}
  */
  getCurrentRepositoryName: function(){
    return Ember.RSVP.resolve(card.consumers.repository.request('getRepository'));
  }
};

export default Repo;
