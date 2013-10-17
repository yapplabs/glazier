import { cardBucketProp } from 'glazier/utils/computed_properties';

var CARD_PREFIX_REGEX = /^card:/,
    get = Ember.get,
    alias = Ember.computed.alias;

var PaneController = Ember.ObjectController.extend(Ember.Evented, {
  needs: ['dashboard', 'dashboard/section', 'clipboard'],
  isAdmin: alias('controllers.dashboard.isAdmin'),
  isHidden: alias('card.hidden'),
  fullSize: false,
  card: null,
  cardIsLoaded: false,
  cardMetadata: cardBucketProp('card', 'cardMetadata'),
  cardTitle: alias('cardMetadata.title'),
  isEditable: alias('cardMetadata.isEditable'),
  isEditing: alias('cardMetadata.isEditing'),
  toolbar: alias('cardMetadata.toolbar'),
  sectionController: alias('controllers.dashboard/section'),
  cardManager: alias('sectionController.cardManager'),
  contentDidChange: function() {
    var self = this;
    var pane = this.get('content');
    if (pane) {
      var cardManager = self.get('cardManager');
      self.set('card', cardManager.load(pane));
    } else {
      this.set('card', null);
    }
  }.observes('content').on('init'),
  cardTitleChanged: function() {
    this.set('content.cardTitle', this.get('cardTitle'));
  }.observes('cardTitle').on('init'),
  watchForCardLoad: function() {
    var controller = this,
        cardReference = this.get('card');

    if (!cardReference) {
      this.set('cardIsLoaded', false);
      return;
    }

    cardReference.sandbox.activatePromise.then(function() {
      controller.set('cardIsLoaded', true);
    }).fail(Ember.RSVP.rethrow);
  }.observes('card').on('init'),
  actions: {
    copyPane: function(pane) {
      this.set('controllers.clipboard.content', pane);
    },
    editPane: function(){ // action handler
      var cardReference = this.get('card');
      cardReference.render('edit');
    },
    finishEditing: function(){ // action handler
      var cardReference = this.get('card');
      cardReference.render('default');
    }
  }
});

export default PaneController;
