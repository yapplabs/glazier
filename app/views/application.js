var ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    var $auth = this.$('#auth');
    var conductorCard = this.get('controller.authCard');
    conductorCard.appendTo($auth[0]).then(function() {
      conductorCard.render();
    });
  }
});

export ApplicationView;
