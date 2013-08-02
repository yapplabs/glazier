import Conductor from 'conductor';

function render(card) {
  card.render();
  return card;
}

function error() {
  console.error('failed to load Pane');
}

var CardView = Ember.View.extend({
  tagName: 'span',
  classNameBindings: 'isLoaded',
  isLoaded: Ember.computed.oneWay('controller.cardIsLoaded'),

  didInsertElement: function () {
    var self = this;
    var pane = this.get('controller.model');

    function success() {
      var card = self.get('controller.card');
      self.appendCard(card);
    }

    if (pane.get('isSaving')) {
      pane.one('becameError',error);
      return pane.one('didCreate', success);
    }

    pane.then(function() {
      var type = pane.get('paneType');
      return type.then(success);
    }).then(null, Conductor.error);
  },

  willDestroyElement: function() {
    var card = this.get('controller.card');
    if (card) {
      card.destroy();
    }
  },

  appendCard: function(card) {
    var element = this.get('element');
    var parentView = this.get('parentView');

    Ember.run.scheduleOnce('afterRender', function() {
      card.appendTo(element).promise.
        then(render).
        then(null, Conductor.error);
    });
  }
});

export default CardView;
