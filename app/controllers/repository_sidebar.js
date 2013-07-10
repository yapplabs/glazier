var RepositorySidebarController = Ember.ObjectController.extend({
  setCurrentRepository: function(repo) {
    this.set('content', repo);
  },
  gravatarUrl: (function(){
    var gravatar_id = this.get('content.owner.gravatar_id');
    if (gravatar_id) {
      return "https://secure.gravatar.com/avatar/" + gravatar_id;
    }
  }).property("content")
});

export default RepositorySidebarController;
