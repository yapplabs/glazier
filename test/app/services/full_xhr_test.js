import 'glazier/services/full_xhr' as FullXhrService;
import { inCard, TestService } from 'helpers/card_test_helpers';

var conductor, card;

if (!/phantom/i.test(navigator.userAgent)) {
  module("Glazier FullXhrService", {
    setup: function() {
      conductor = new Conductor({
        testing: true
      });

      Conductor.services['fullXhr'] = FullXhrService;
      Conductor.services['test'] = TestService;

      card = conductor.load('/test/fixtures/app/services/full_xhr_card.js', 1, {
        capabilities: ['fullXhr', 'test', 'assertion']
      });
      card.then(null, function(e){ console.log(e); });
      card.appendTo('#qunit-fixture');
    }
  });

  asyncTest("A card can return a configuration value by name", 1, function() {
    inCard(card, function(card){
      var fullXhrService = card.consumers.fullXhr;
      fullXhrService.request('ajax', {
        url: '/test/fixtures/app/services/foo.txt'
      }).then(function(result){
        ok(/bar/.test(result), 'retrieves text from fixture via xhr');
        start();
      });
    });
  });
}
