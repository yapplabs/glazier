import Conductor from 'conductor';

var PaneView = Ember.View.extend({
  init: function () {
    this._super();
    this.cardManager = this.container.lookup('cardManager:main');
  },

  didInsertElement: function () {
    var self = this;
    var cardManager = this.cardManager;
    var pane = this.get('content');
    pane.then(function() {
      var type = pane.get('cardManifest');
      var promises = [type];

      return Ember.RSVP.all(promises).then(function () {
        var card = cardManager.load(pane);
        self.appendCard(card);
      });

    }).then(null, Conductor.error);
  },

  willDestroyElement: function() {
    var pane = this.get('content');
    this.cardManager.unload(pane);
  },

  appendCard: function(card) {
    var $paneElement, $element = this.$();

    if (card.hidden) {
      $element.addClass('hidden-pane');
      $paneElement = $element;
    } else {
      $element.addClass('block pane-wrapper');
      $paneElement = Ember.$("<div class='pane'>");
      $element.append($paneElement);
      $paneElement.append("<div class='pane-footer'>");
    }

    card.appendTo($paneElement[0]).promise.then(function(card) {
      card.render();
    }).then(null, Conductor.error);
  }
});

export default PaneView;
