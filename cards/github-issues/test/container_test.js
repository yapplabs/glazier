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

    Conductor.services['repository'] = Conductor.Oasis.Service.extend({
      requests: {
        getRepository: function(promise) {
          promise.resolve('emberjs/ember.js');
        }
      }
    });

    card = conductor.load('/cards/github-issues.js', 1, {
      capabilities: ['test', 'repository']
    });
    card.then(null, function(e){ console.log(e); });
    card.appendTo('#qunit-fixture');
  },

  teardown: function() {

  }
});

asyncTest("it renders", 1, function(){
  inCard(card, function(card, resolver){
    card.render().then(function(){
      equal($('h3').text(), 'Github Issues for emberjs/ember.js');
      start();
      resolver.resolve();
    }, function(e){
      ok(false, e);
      resolver.reject();
    });

  }).then(null, console.error);
});
