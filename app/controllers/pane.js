import { cardBucketProp } from 'glazier/utils/computed_properties';

var CARD_PREFIX_REGEX = /^card:/,
    get = Ember.get;

var PaneController = Ember.ObjectController.extend(Ember.Evented, {
  init: function() {
    this._super();
    this.contentDidChange();
  },
  needs: ['dashboard'],
  isAdmin: Ember.computed.alias('controllers.dashboard.isAdmin'),
  isHidden: Ember.computed.alias('card.hidden'),
  card: null,
  cardIsLoaded: false,
  cardMetadata: cardBucketProp('card', 'cardMetadata'),
  isEditable: Ember.computed.alias('cardMetadata.isEditable'),
  contentDidChange: function() {
    var pane = this.get('content');
    if (pane) {
      var dashboard = pane.get('dashboard');
      var cardManager = this.get('controllers.dashboard.cardManager');
      this.set('card', cardManager.load(pane));
    } else {
      this.set('card', null);
    }
  }.observes('content'),
  editPane: function(){ // action handler
    var cardReference = this.get('card');
    cardReference.render('edit');
  },
  watchForCardLoad: function() {
    var controller = this,
        cardReference = this.get('card');

    if (!cardReference) {
      this.set('cardIsLoaded', false);
      return;
    }

    cardReference.sandbox.activatePromise.then(function() {
      controller.set('cardIsLoaded', true);
    }).then(null, Conductor.error);
  }.observes('card')
});

export default PaneController;
