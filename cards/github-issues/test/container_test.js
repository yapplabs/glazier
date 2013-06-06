module("Github::Issues Acceptances");
import { inCard, TestService } from 'helpers/card_test_helpers';

var conductor, card;

if (/phantom/i.test(navigator.userAgent)) { return; }

module("Github::Issues Acceptances", {
  setup: function() {

    conductor = new Conductor({
      testing: true
    });

    Conductor.services['test'] = TestService;

    card = conductor.load('/cards/github-issues.js', 1, {
      capabilities: ['test']
    });
    card.then(null, function(e){ console.log(e); });
    card.appendTo('#qunit-fixture');
  },

  teardown: function() {

  }
});

asyncTest("it renders", 1, function(){
  inCard(card, function(card){
    card.render().then(function(){
      start();
      equal($('h3').text(), 'Github Issues');
    }, function(e){
      ok(false, e);
    });

  }).then(null, console.error);
});
