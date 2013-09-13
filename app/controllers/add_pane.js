var AddPaneController = Ember.ObjectController.extend({
  needs: ['dashboard', 'pane_types'],
  content: Ember.computed.alias('controllers.dashboard.content'),

  paneTypes: Ember.computed.alias('controllers.pane_types'),

  addablePaneTypes: function() {
    var paneTypes = this.get('paneTypes');
    var panes = this.get('panes');

    return this.get('store').filter(Glazier.PaneType, function(paneType) {
      var isProvider = paneType.get('isProvider'),
        hasUI = paneType.get('hasUI');

      if (hasUI) {
        if (isProvider) {
          return !panes.someProperty('paneType', paneType);
        }
        return true;
      }
    });
  }.property('panes.[]')
});

export default AddPaneController;
