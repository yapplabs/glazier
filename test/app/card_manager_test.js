import 'glazier/card_manager' as CardManager;
import 'glazier/models/pane' as Pane;
import 'glazier/models/card_manifest' as CardManifest;
import 'glazier/models/capability_provider' as CapabilityProvider;

var cardManager, pane, store;

if (/phantom/i.test(navigator.userAgent)) {
  return; // these tests do not work in grunt
}

Pane.FIXTURES = [
  {
    id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2',
    cardManifest: '/cards/github-repositories/manifest.json',
    capabilityProviders: ['1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2,7f878b1a-34af-42ed-b477-878721cbc90d']
  },
  {
    id: 'd30608af-11d8-402f-80a3-1f458650dbef',
    cardManifest: '/cards/github-repositories/manifest.json',
    capabilityProviders: ['d30608af-11d8-402f-80a3-1f458650dbef,7f878b1a-34af-42ed-b477-878721cbc90d']
  }
];

CapabilityProvider.FIXTURES = [
  {
    id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2,7f878b1a-34af-42ed-b477-878721cbc90d',
    capability: 'github:authenticated:read',
    provider: '7f878b1a-34af-42ed-b477-878721cbc90d'
  },
  {
    id: 'd30608af-11d8-402f-80a3-1f458650dbef,7f878b1a-34af-42ed-b477-878721cbc90d',
    capability: 'github:authenticated:read',
    provider: '7f878b1a-34af-42ed-b477-878721cbc90d'
  }
];

CardManifest.FIXTURES = [
  {
    id: '/cards/github-repositories/manifest.json',
    manifest: {
      cardUrl: '/cards/github-repositories/card.js',
      consumes: [ 'github:authenticated:read' ]
    }
  }
];


module("CardManager", {
  setup: function() {
    var conductor = new Conductor({
      testing: true
    });

    var store = DS.Store.create({
      adapter: DS.FixtureAdapter // TODO lower delay for tests
    });

    cardManager = CardManager.create({
      conductor: conductor
    });

    store.load(CardManifest, '/cards/github-auth/manifest.json', {
      manifest: {
        cardUrl: '/cards/github-auth/card.js',
        consumes: [ 'fullXhr', 'configuration', 'userStorage', 'identity' ],
        provides: ['github:authenticated:read']
      }
    });

    store.load(Pane, '7f878b1a-34af-42ed-b477-878721cbc90d', {
      cardManifest: '/cards/github-auth/manifest.json'
    });

    pane = store.find(Pane, '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2');

    var authPane = store.find(Pane, '7f878b1a-34af-42ed-b477-878721cbc90d');
    var cardType = store.find(CardManifest, '/cards/github-auth/manifest.json');

    Ember.RSVP.all([authPane, cardType]).then(function() {
      cardManager.load(authPane);
      start();
    }).then(null, function(e) {
      console.error('error:', e);
      start();
    });

    stop();
  },
  teardown: function() {

  }
});

asyncTest("loading a card sets targets and consumes", 2, function(){
  pane.then(function() {
    Ember.RSVP.all([pane.get('cardManifest'), pane.get('capabilityProviders')]).then(function () {
      var card = cardManager.load(pane);
      ok(card.targets['github:authenticated:read'], "target was set on the loaded card");
      ok(card.consumes['github:authenticated:read'], "consumes was set on the loaded card");
      start();
    });
  });
});

asyncTest("loading and unloading a card", 2, function(){
  pane.then(function() {
    Ember.RSVP.all([pane.get('cardManifest'), pane.get('capabilityProviders')]).then(function () {
      var card = cardManager.load(pane);
      var repeat = cardManager.load(pane);
      equal(card, repeat, 'The same instance of card was returned from successive calls to load');

      cardManager.unload(pane);

      var afterUnload = cardManager.load(pane);
      notEqual(afterUnload, card, "After unloading, loading from the same pane returns a different card instance");

      start();
    });
  });
});
