var PaneTypesController = Ember.ArrayController.extend({
  content: function() {
    return this.get('store').find('pane_type');
  }.property()
});

export default PaneTypesController;
