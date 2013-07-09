var CardDataManager = Ember.Object.extend({
  userController: null,
  repositoryController: null,
  repositoryName: Ember.computed.alias('repositoryController.path'),
  user: Ember.computed.alias('userController.content'),
  getAmbientData: function() {
    return {
      repositoryName: this.get('repositoryName'),
      user: this.get('user')
    };
  }
});

export default CardDataManager;
