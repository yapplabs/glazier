import { cardBucketProp } from 'glazier/utils/computed_properties';

var CARD_PREFIX_REGEX = /^card:/,
    get = Ember.get,
    alias = Ember.computed.alias;

var PaneController = Ember.ObjectController.extend(Ember.Evented, {
  needs: ['dashboard'],
  isAdmin: alias('controllers.dashboard.isAdmin'),
  isHidden: false,
  fullSize: false,
  card: null,
  cardIsLoaded: false,
  cardMetadata: cardBucketProp('card', 'cardMetadata'),
  isEditable: alias('cardMetadata.isEditable'),
  isEditing: alias('cardMetadata.isEditing'),
  toolbar: alias('cardMetadata.toolbar'),
  editPane: function(){ // action handler
    var cardReference = this.get('card');
    cardReference.render('edit');
  },
  finishEditing: function(){ // action handler
    var cardReference = this.get('card');
    cardReference.render('default');
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
