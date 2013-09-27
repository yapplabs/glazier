var ModalPaneTypeView = Ember.View.extend({
  didInsertElement: function() {
    this.appendCard();
  },
  appendCard: function() {
    var card = this.get('controller.content');

    if (card) {
      var promise = card.appendTo(this.get('element'));
      promise.then(function() {
        card.render();
      });
    }
  },

  // The modal doesn't rerender when used twice in a row if only
  // listening to the controller (which is the same object each time)
  contentChanged: function() {
    this.rerender();
  }.observes('controller.content'),

  willDestroyElement: function() {
    var card = this.get('controller.content');
    if (card) {
      card.destroy();
    }
  }
});

export default ModalPaneTypeView;
