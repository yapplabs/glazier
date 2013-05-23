import FullXhrService from 'glazier/services/full_xhr';

var conductor, card, queueCardTest, TestService, testQueue, queuePromise;
testQueue = [];
queueCardTest = function(f) {
  testQueue.push(f);
  if (queuePromise) {
    queuePromise.resolve(testQueue.pop().toString());
    queuePromise = null;
  }
};

TestService = Conductor.Oasis.Service.extend({
  requests: {
    runTest: function(promise) {
      if (testQueue.length > 0) {
        promise.resolve(testQueue.pop().toString());
      } else {
        queuePromise = promise;
      }
    }
  }
});

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
    card.appendTo('#qunit-fixture');
  },
  teardown: function() {
  }
});

test("A card can return a configuration value by name", function() {
  expect(1);
  stop();
  queueCardTest(function(card){
    var fullXhrService = card.consumers.fullXhr;
    fullXhrService.request('ajax', {
      url: '/test/fixtures/app/services/foo.txt'
    }).then(function(result){
      ok(/bar/.test(result), 'retrieves text from fixture via xhr');
      start();
    });
  });
});

