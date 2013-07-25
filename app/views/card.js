import Conductor from 'conductor';

function render (card) { 
  card.render();
  return card;
}

function error() {
  console.error('failed to load Pane');
}

var CardView = Ember.View.extend({
  tagName: 'span',
  init: function () {
    this._super();
    this.cardManager = this.container.lookup('cardManager:main');
  },

  didInsertElement: function () {
    var self = this;
    var cardManager = this.cardManager;
    var pane = this.get('controller.model');

    function success() {
      var card = cardManager.load(pane);
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
    var pane = this.get('controller.model');
    this.cardManager.unload(pane);
  },

  appendCard: function(card) {
    var element = this.get('element');
    var parentView = this.get('parentView');

    this.set('controller.card', card);
    this.set('controller.isHidden', card.hidden);

    Em.run.scheduleOnce('afterRender', function() {
      card.appendTo(element).promise.
        then(render).
        then(null, Conductor.error);
    });
  }
});

export default CardView;;
