var ApplicationController = Ember.ArrayController.extend({
  init: function (){
    this._super();
    this.set('myIssues', []);
  },
  repositoryName: null,
  isDisabled: false,
  user: Ember.computed.alias('cardDataStore.user'),
  userDidChange: function() {
    this.send('currentUserChanged', this.get('user'));
  }.observes('user')
});

export default ApplicationController;
