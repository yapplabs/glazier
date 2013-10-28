import analyticsCardBootstrap from "conductor/analytics/bootstrap";

var analyticsCard;

var initializer = {
  name: 'conductorAnalytics',
  before: 'conductorServices',

  initialize: function (container, application) {
    var sk = window.StarterKit;

    if(sk) {
      sk.wiretapCard = function(card) {
        analyticsCard.track( card );
      };

      sk.initializeAnalytics = function(conductor) {
        analyticsCard = analyticsCardBootstrap.initializeConductorAnalytics(
          conductor,
          '/vendor/conductor-analytics/card.js'
        );
      };

      sk.insertAnalytics = function($analytics) {
        analyticsCard.appendTo( $analytics );
        analyticsCard.render();
      };
    }
  }
};

export default initializer;
