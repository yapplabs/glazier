import FullXhrService from 'glazier/services/full_xhr';
import { inCard, TestService } from 'helpers/card_test_helpers';

import Condcutor from 'conductor';

var conductor, card;

if (/phantom/i.test(navigator.userAgent)) { return; }

module("Glazier FullXhrService", {
  setup: function() {
    conductor = new Conductor({
      testing: true,
      conductorURL: '/vendor/conductor.js.html'
    });

    Conductor.services['fullXhr'] = FullXhrService;
    Conductor.services['test'] = TestService;

    card = conductor.load('/test/fixtures/app/services/full_xhr_card.js', 1, {
      capabilities: ['fullXhr', 'test']
    });

    card.appendTo('#qunit-fixture');
  }
});

asyncTest("A card can retrieve data via XHR", 1, function() {
  inCard(card, function(card) {
    var fullXhrService = card.consumers.fullXhr;

    return fullXhrService.request('ajax', {
      url: '/test/fixtures/app/services/foo.txt'
    }).then(function(result) {
      start();
      ok( /bar/.test(result), 'retrieves text from fixture via xhr');
      return result;
    });
  });
});
