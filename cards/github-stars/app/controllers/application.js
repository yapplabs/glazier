var ApplicationController = Ember.ObjectController.extend({
  loggedIn: Ember.computed.bool('user')
});

export default ApplicationController;
