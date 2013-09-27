var ModalView = Ember.View.extend({
  click: function(e) {
    if (Ember.$('#modal-content').find(e.target).length === 0) {
      this.get('controller').send('hideModal');
    }
  }
});

export default ModalView;
