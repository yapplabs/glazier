var RepositorySidebarController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  path: Ember.computed.alias('controllers.dashboard.id'),
  setCurrentRepository: function(repo) {
    this.set('content', repo);
  },
  gravatarUrl: (function(){
    return "https://secure.gravatar.com/avatar/" + this.get('content.owner.gravatar_id');
  }).property("content"),
  //TODO: real formats - these for demo only
  createdDate: (function(){
    var createdDate = this.get('content.created_at');
    return createdDate ? createdDate.slice(0,10) : "";
  }).property("content"),
  lastCommitDate: (function(){
    var lastCommitDate = this.get('content.pushed_at');
    return lastCommitDate ? lastCommitDate.slice(0,10) : "";
  }).property("content")

});

export = RepositorySidebarController;
