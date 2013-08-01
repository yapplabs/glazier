var ApplicationRoute = Ember.Route.extend({
  beforeModel: function(){
    var userId = getUserIdFromCookie();
    if (!userId) { return; } // no cookie yet - not logged in

    var userController = this.controllerFor('user');
    return Ember.$.ajax({
      url: '/api/user',
      dataType: 'json'
    }).then(function(data) {
      userController.set('content', data && data.user);
    });
  },
  setupController: function(data) {
    this.controllerFor('application').set('isReady', true);
  },
  showModal: function(name){
    this.render(name, { into: 'modal' });
    this.controllerFor('modal').set('isVisible', true);
    this.controllerFor('application').set('modalIsVisible', true);

    if (name === 'reorder_panes') {
      this.controllerFor('dashboard').set('hidePanes', true);
    }
  },
  hideModal: function(){
    this.controllerFor('modal').set('isVisible', false);
    this.controllerFor('application').set('modalIsVisible', false);
    this.controllerFor('dashboard').set('hidePanes', false);
  },
  events: {
    showAddPane: function() {
      this.showModal('add_pane');
    },
    showReorderPanes: function() {
      this.showModal('reorder_panes');
    },
    showModal: function(name) {
      this.showModal(name);
    },
    hideModal: function() {
      this.hideModal();
    },
    reorderedPanes: function(){
      this.hideModal();
    },
    userDidChange: function(){

    }
  }
});

function getUserIdFromCookie(){
  var cookies = document.cookie.split(/\s*;\s*/);
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i],
        match = /^login=.+?\-(.+)/.exec(cookie);
    if (match) {
      return JSON.parse(decodeURIComponent(match[1])).github_id;
    }
  }
  return null;
}

export default ApplicationRoute;
