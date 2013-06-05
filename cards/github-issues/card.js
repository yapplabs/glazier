Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.requireCSS('/cards/github-issues/style.css');

import { App } from 'app/application';

var card = Conductor.card({
  consumers: {
    'github:authenticated:read': Conductor.Oasis.Consumer,
    test: Conductor.Oasis.Consumer.extend({
      requests: {
        runTest:  function(promise, testData){
          var testFn = new Function('return ' + testData.fnString)();

          testFn.call(window, card, promise);
        }
      }
    })
  },

  render: function (intent, dimensions) {
    if (!dimensions) { dimensions = {width:500,height:500}; }
    document.body.innerHTML = "<div id=\"card\"></div>";

    Ember.run(App, 'advanceReadiness');

    return App;
  },

  activate: function() {
    console.log('activate');
    var card = this;

    App.deferReadiness();
  },

  metadata: {
    document: function(promise) {
      promise.resolve({
        title: "Github Issues"
      });
    }
  },

  resize: function(dimensions) {
    var width = Math.min(dimensions.width, 500);
    var height = Math.min(dimensions.height, 500);

    $('body>div').css({
      width: width
    });
  }
});
