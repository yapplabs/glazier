Conductor.require('/vendor/jquery.js');
Conductor.require('/vendor/handlebars.js');
Conductor.require('/vendor/ember-latest.js');
Conductor.requireCSS('/cards/github-issues/css/style.css');

var App;

Conductor.card({
  consumers: {
    'github:authenticated:read': Conductor.Oasis.Consumer
  },

  render: function (intent, dimensions) {
    if (!dimensions) { dimensions = {width:500,height:500}; }
    document.body.innerHTML = "<div id=\"card\"></div>";
    App.advanceReadiness();
  },

  activate: function() {
    var card = this;
    App = Ember.Application.create({
      rootElement: '#card'
    });

    App.deferReadiness();

    Ember.TEMPLATES['application'] = Ember.Handlebars.compile(
      "<h3>Github Issues</h3>"
    );

    App.ApplicationController = Ember.ArrayController.extend();
    App.ApplicationRoute = Ember.Route.extend({
      model: function(){
      }
    });
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
