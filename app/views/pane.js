import Conductor from 'conductor';

function render (card) { 
  card.render();
  return card;
}
var PaneView = Ember.View.extend({
  templateName: 'pane',
  classNameBindings: [
    'view.isHidden:hidden-pane',
    ':pane-wrapper',
    'fullSize'
  ],
  fullSize: false,
  showCard: false,
  init: function () {
    this._super();
    this.cardManager = this.container.lookup('cardManager:main');
  },

  didInsertElement: function () {
    var self = this;
    var cardManager = this.cardManager;
    var pane = this.get('content');

    function success() {
      var card = cardManager.load(pane);
      self.appendCard(card);
    }

    function error() {
      console.error('failed to load Pane');
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
    var pane = this.get('content');
    this.cardManager.unload(pane);
  },

  appendCard: function(card) {
    var view = this;

    this.set('card', card); // template will update to get a .pane element

    Em.run.scheduleOnce('afterRender', function() {
      var $pane = view.$('.pane');
      var expand = view.$('.toggle-full-size');

      expand.click(function(e) {
        e.preventDefault();
        view.toggleProperty("fullSize");
      });

      view.set('isHidden', card.hidden);

      card.appendTo($pane[0]).promise.
        then(render).
        then(null, Conductor.error);
    });
  }
});

export default PaneView;
