var CARD_PREFIX_REGEX = /^card:/;

var PaneController = Ember.ObjectController.extend(Ember.Evented, {
  needs: ['dashboard'],
  isAdmin: Ember.computed.alias('controllers.dashboard.isAdmin'),
  isHidden: false,
  card: null,
  cardMetadata: null, // set by syncCardMetaData
  isEditable: Ember.computed.alias('cardMetadata.isEditable'),
  editPane: function(){ // action handler
    var cardReference = this.get('card');
    cardReference.render('edit');
  },
  syncCardMetaData: function(){
    var controller = this,
        cardReference = this.get('card');
    if (cardReference) {
      cardReference.sandbox.promise.then(function() {
        return cardReference.metadataFor('card');
      }).then(function(metadata){
        controller.set('cardMetadata', metadata);
        controller.attachToMetadataPort();
      }).then(null, Conductor.error);
    } else {
      controller.set('cardMetadata', null);
    }
  }.observes('card'),
  attachToMetadataPort: function(){
    var controller = this,
        cardReference = this.get('card');
    if (cardReference.sandbox.metadataUpdatePort) {
      cardReference.sandbox.metadataUpdatePort.trigger = function(name, bucket, data){
        if (name === 'updatedData' && bucket === 'card') {
          controller.set('cardMetadata', data);
        }
      };
    }
  }
});

export default PaneController;
