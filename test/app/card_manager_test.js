import isolatedContainer from 'helpers/container_test_helpers';

import CardManager from 'glazier/card_manager';
import Pane from 'glazier/models/pane';
import PaneType from 'glazier/models/pane_type';

import Conductor from 'conductor';

var cardManager, pane, store, conductor;

if (/phantom/i.test(navigator.userAgent)) {
  return; // these tests do not work in grunt
}

module("CardManager", {
  setup: function() {
    var conductor = new Conductor({
      testing: true,
      conductorURL: '/vendor/conductor.js.html'
    });

    var container = isolatedContainer(
      ['model:pane',
       'model:pane_type',
       'model:section',
       'serializer:application'
      ]);
    var Store = DS.Store.extend({
      adapter: DS.FixtureAdapter // TODO lower delay for tests
    });
    container.register('store:main', Store);
    container.register('card_manager:main', CardManager);

    cardManager = container.lookup('card_manager:main');
    cardManager.conductor = conductor
    cardManager.set('cardDataManager', Ember.Object.create({
      getAmbientData: function() {
        return {};
      }
    }));
    var store = container.lookup('store:main');

    store.push('pane_type', {
      id: '/cards/github-auth/manifest.json',
      manifest: {
        cardUrl: '/cards/github-auth/card.js',
        consumes: [ 'fullXhr', 'configuration', 'paneUserStorage' ],
        provides: ['githubAuthenticatedRead'],
        env: 'dev'
      }
    });
    store.push('pane_type', {
      id: '/cards/github-repositories/manifest.json',
      manifest: {
        cardUrl: '/cards/github-repositories/card.js',
        consumes: [ 'githubAuthenticatedRead' ],
        env: 'dev'
      }
    });

    cardManager.setProviderCardCatalog(Ember.Object.create({
      providedCapabilities: []
    }));

    store.push('pane', {
      id: '7f878b1a-34af-42ed-b477-878721cbc90d',
      paneType: '/cards/github-auth/manifest.json'
    });
    store.push('pane', {
      id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2',
      paneType: '/cards/github-repositories/manifest.json'
    });
    store.push('pane', {
      id: 'd30608af-11d8-402f-80a3-1f458650dbef',
      paneType: '/cards/github-repositories/manifest.json'
    });

    pane = store.find('pane', '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2');

    var authPane = store.find('pane', '7f878b1a-34af-42ed-b477-878721cbc90d');
    var cardType = store.find('pane_type', '/cards/github-auth/manifest.json');

    Ember.RSVP.all([authPane, cardType]).then(function() {
      start();
      cardManager.load(authPane);
    }).then(null, function(e) {
      start();
      throw e;
    }).then(null, Conductor.error);

    stop();
  },
  teardown: function() {
    cardManager = null;
    pane = null;
    store = null;
    conductor = null;
  }
});

asyncTest("loading a card sets providerPromises and consumes", 2, function(){
  pane.then(function() {
    start();
    var card = cardManager.load(pane);
    ok(card.providerPromises['githubAuthenticatedRead'], "target was set on the loaded card");
    ok(card.consumes['githubAuthenticatedRead'], "consumes was set on the loaded card");
  }).then(null, Conductor.error);
});

asyncTest("loading and unloading a card", 2, function(){
  pane.then(function() {
    start();
    var card = cardManager.load(pane);
    var repeat = cardManager.load(pane);
    equal(card, repeat, 'The same instance of card was returned from successive calls to load');

    cardManager.unload(pane);

    var afterUnload = cardManager.load(pane);
    notEqual(afterUnload, card, "After unloading, loading from the same pane returns a different card instance");
  }).then(null, Conductor.error);
});
