var PaneTypesController = Ember.ArrayController.extend({
  content: function() {
    return this.get('store').find(Glazier.PaneType);
  }.property()
});

export default PaneTypesController;
