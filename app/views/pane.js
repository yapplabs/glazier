import Conductor from 'conductor';

var PaneView = Ember.View.extend({
  classNameBindings: ['hiddenPane'],
  templateName: 'pane',
  init: function () {
    this._super();
    this.cardManager = this.container.lookup('cardManager:main');
  },

  didInsertElement: function () {
    var self = this;
    var cardManager = this.cardManager;
    var pane = this.get('content');

    var success = function() {
      var card = cardManager.load(pane);
      self.appendCard(card);
    };

    if (pane.get('isSaving')) {
      pane.one('becameError', function() { console.error('failed to load Pane'); });
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
    var $paneElement, view = this;

    this.set('card', card); // template will update to get a .pane element
    if (card.hidden) {
      view.set('hiddenPane', true);
    }

    Em.run.scheduleOnce('afterRender', function() {
      if (card.hidden) {
        $paneElement = view.$();
      } else {
        $paneElement = view.$('.pane');
      }

      card.appendTo($paneElement[0]).promise.then(function(card) {
        card.render();
      }).then(null, Conductor.error);
    });
  }
});

export default PaneView;
