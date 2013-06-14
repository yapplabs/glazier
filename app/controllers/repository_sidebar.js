var RepositorySidebarController = Ember.ObjectController.extend({
  setCurrentRepository: function(repo) {
    this.set('content', repo);
  },
  gravatarUrl: (function(){
    return "https://secure.gravatar.com/avatar/" + this.get('content.owner.gravatar_id');
  }).property("content")
});

export = RepositorySidebarController;
