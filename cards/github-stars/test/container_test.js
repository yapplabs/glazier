module("Github::Stars Acceptances");
import { inCard, TestService } from 'helpers/card_test_helpers';

var conductor, card;

if (/phantom/i.test(navigator.userAgent)) { return; }

module("Github::Stars Acceptances", {
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
    Conductor.services['unauthenticatedGithubApi'] = Conductor.Oasis.Service.extend({
      requests: {
        ajax: function(promise, ajaxOpts) {
          promise.resolve([]);
        }
      }
    });

    card = conductor.load('/cards/github-stars/card.js', 1, {
      capabilities: ['test', 'repository', 'unauthenticatedGithubApi']
    });
    card.then(null, function(e){ console.log(e); });
    card.appendTo('#qunit-fixture');
  },

  teardown: function() {

  }
});

asyncTest("it renders", 1, function(){
  inCard(card, function(card, resolver){
    function fail(e) {
      ok(false, e);
      resolver.reject();
    }
    function wait() {
      var promise, obj = {}, helperName;

      return new Ember.RSVP.Promise(function(resolve) {
        var watcher = setInterval(function() {
          var routerIsLoading = window.App.__container__.lookup('router:main').router.isLoading;
          if (routerIsLoading) { return; }
          if (Ember.run.hasScheduledTimers() || Ember.run.currentRunLoop) { return; }
          clearInterval(watcher);
          Ember.run(function() {
            resolve();
          });
        }, 10);
      });
    }
    card.render().then(function(){
      wait().then(function(){
        equal($('h3').text(), 'Github Stargazers for emberjs/ember.js');
        start();
        resolver.resolve();
      }).then(null, fail);
    }, fail);
  }).then(null, console.error);
});
