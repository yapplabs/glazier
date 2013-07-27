var RepositoryHeaderController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  content: Ember.computed.alias('controllers.dashboard.content.repository'),
  gravatarUrl: (function(){
    var gravatar_id = this.get('content.owner.gravatar_id');
    if (gravatar_id) {
      return "https://secure.gravatar.com/avatar/" + gravatar_id;
    }
  }).property("content"),
});

export default RepositoryHeaderController;
