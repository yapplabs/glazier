var ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    var $auth = this.$('#auth');
    var card = this.get('controller.authCard');
    card.appendTo($auth[0]).then(function() {
      card.render();
    });
  }
});

export ApplicationView;
