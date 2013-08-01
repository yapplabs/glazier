import PaneController from 'glazier/controllers/pane';

var paneController;

module("PaneController", {
  setup: function(){
    var container = new Ember.Container();
    container.register('controller:dashboard', Ember.Controller.extend());

    paneController = PaneController.create({
      container: container
    });
  },
  teardown: function() {
    paneController = null;
  }
});

test("cardMetadata property delegates to the card's remoteEmberObjectService", function() {
  var stubBucket = {};
  var cardReference = { sandbox: {} };
  cardReference.sandbox.activatePromise = Conductor.Oasis.RSVP.resolve().then(function(){
    cardReference.sandbox.remoteEmberObjectPort = {
      service: {
        getBucket: function(bucketName) {
          return stubBucket;
        }
      }
    };
  });

  paneController.set('card', cardReference);
  equal(paneController.get('cardMetadata.isLoading'), true, "returns proxy with isLoading flag");

  paneController.get('cardMetadata').promise.then(function(){
    start();
    equal(paneController.get('cardMetadata.content'), stubBucket, "sets content to stubBucket");
  });
  stop();
});

test("cardMetadata property returns undefined when remoteEmberObjectService not available", function() {
  var stubBucket = {};
  var cardReference = { sandbox: {} };
  cardReference.sandbox.activatePromise = Conductor.Oasis.RSVP.resolve();
  paneController.set('card', cardReference);
  cardReference.sandbox.activatePromise.then(function(){
    start();
    equal(paneController.get('cardMetadata.content'), undefined, "sets content to undefined");
  });
  stop();
});
