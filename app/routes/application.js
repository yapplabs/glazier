import ajax from 'glazier/utils/ajax';

var ApplicationRoute = Ember.Route.extend({
  beforeModel: function(){
    var userController = this.controllerFor('user');
    var login = this.container.lookup('behavior:login');

    login().then(function(user){
      // null object pattern might be better.
      if (user) {
        userController.set('content', user);
      }
    });

    return null; // Ziniki related race condition
  },
  setupController: function(data) {
    this.controllerFor('application').set('isReady', true);
  },
  showModal: function(name){
    this.render(name, { into: 'modal', outlet: 'modal' });
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
    this.disconnectOutlet({ parentView: 'modal' });
  },
  actions: {
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
    willReorderPanes: Ember.K,
    didReorderPanes: function(){
      this.hideModal();
    },
    userDidChange: function(){

    },
    navigateToHome: function() {
      this.transitionTo('index');
    }
  }
});

export default ApplicationRoute;
