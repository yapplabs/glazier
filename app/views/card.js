import Conductor from 'conductor';

function render(cardReference) {
  cardReference.render();
  return cardReference;
}

function error() {
  console.error('failed to load Pane');
}

var CardView = Ember.View.extend({
  tagName: 'span',
  classNameBindings: 'isLoaded',
  isLoaded: Ember.computed.oneWay('controller.cardIsLoaded'),
  init: function () {
    this._super();
    this.cardManager = this.container.lookup('cardManager:main');
  },

  didInsertElement: function () {
    var self = this;
    var cardManager = this.cardManager;
    var pane = this.get('controller.model');

    function success() {
      var cardReference = cardManager.load(pane);
      self.appendCard(cardReference);
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

  appendCard: function(cardReference) {
    var element = this.get('element');
    var parentView = this.get('parentView');

    this.set('controller.card', cardReference);
    this.set('controller.isHidden', cardReference.hidden);

    Ember.run.scheduleOnce('afterRender', function() {
      cardReference.appendTo(element).promise.
        then(render).
        then(null, Conductor.error);
    });
  }
});

export default CardView;
