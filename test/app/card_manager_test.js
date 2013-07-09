import CardManager from 'glazier/card_manager';
import Pane from 'glazier/models/pane';
import PaneType from 'glazier/models/pane_type';

import Conductor from 'conductor';

var cardManager, pane, store;

if (/phantom/i.test(navigator.userAgent)) {
  return; // these tests do not work in grunt
}

Pane.FIXTURES = [
  {
    id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2',
    paneType: '/cards/github-repositories/manifest.json'
  },
  {
    id: 'd30608af-11d8-402f-80a3-1f458650dbef',
    paneType: '/cards/github-repositories/manifest.json'
  }
];

PaneType.FIXTURES = [
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
      testing: true,
      conductorURL: '/vendor/conductor.js.html'
    });

    var store = DS.Store.create({
      adapter: DS.FixtureAdapter // TODO lower delay for tests
    });

    cardManager = CardManager.create({
      conductor: conductor,
      cardDataManager: Ember.Object.create({
        getAmbientData: function() {
          return {};
        }
      })
    });

    store.load(PaneType, '/cards/github-auth/manifest.json', {
      manifest: {
        cardUrl: '/cards/github-auth/card.js',
        consumes: [ 'fullXhr', 'configuration', 'paneUserStorage', 'identity' ],
        provides: ['github:authenticated:read']
      }
    });

    store.load(Pane, '7f878b1a-34af-42ed-b477-878721cbc90d', {
      paneType: '/cards/github-auth/manifest.json'
    });

    pane = store.find(Pane, '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2');

    var authPane = store.find(Pane, '7f878b1a-34af-42ed-b477-878721cbc90d');
    var cardType = store.find(PaneType, '/cards/github-auth/manifest.json');

    Ember.RSVP.all([authPane, cardType]).then(function() {
      start();
      cardManager.load(authPane);
    }).then(null, function(e) {
      start();
      console.error('error:', e);
    }).then(null, Conductor.error);

    stop();
  },
  teardown: function() {

  }
});

asyncTest("loading a card sets providerPromises and consumes", 2, function(){
  pane.then(function() {
    pane.get('paneType').then(function () {
      start();
      var card = cardManager.load(pane);
      ok(card.providerPromises['github:authenticated:read'], "target was set on the loaded card");
      ok(card.consumes['github:authenticated:read'], "consumes was set on the loaded card");
    }).then(null, Conductor.error);
  });
});

asyncTest("loading and unloading a card", 2, function(){
  pane.then(function() {
    pane.get('paneType').then(function () {
      start();
      var card = cardManager.load(pane);
      var repeat = cardManager.load(pane);
      equal(card, repeat, 'The same instance of card was returned from successive calls to load');

      cardManager.unload(pane);

      var afterUnload = cardManager.load(pane);
      notEqual(afterUnload, card, "After unloading, loading from the same pane returns a different card instance");

    }).then(null, Conductor.error);
  });
});
