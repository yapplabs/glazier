var CardDataManager = Ember.Object.extend({
  userController: null,
  repositoryController: null,
  repositoryName: Ember.computed.alias('repositoryController.path'),
  user: Ember.computed.alias('userController.content'),
  getAmbientData: function() {
    return {
      repositoryName: this.get('repositoryName'),
      user: this.get('user'),
      userCanEditRepistory: true // editableRepositoryController.content includes repositoryName
    };
  }
});

export default CardDataManager;

// include editbble repos in user data
// fetch them if logged in but they are missing (from user serialize)
// creating session returns it
// if you have session but don't have editbble repos in user model, fetch it.  cookie only has user id and always fetch if we need it
