var RepositorySidebarController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  setCurrentRepository: function(repo) {
    this.set('content', repo);
  },
  gravatarUrl: (function(){
    return "https://secure.gravatar.com/avatar/" + this.get('content.owner.gravatar_id');
  }).property("content")
});

export = RepositorySidebarController;
