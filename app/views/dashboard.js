var DashboardView = Ember.View.extend({
  elementId: 'dashboard',
  classNames: ['block-group'],
  classNameBindings: [
    'controller.hidePanes'
  ]
});

export default DashboardView;
