import ConfigurationService from 'glazier/services/configuration';
import FullXhrService from 'glazier/services/full_xhr';

var ApplicationView = Ember.View.extend({
  didInsertElement: function() {
    var conductor = new Conductor(),
        cardUrl = "/cards/github-auth/card.js",
        cardId = 1,
        card, $cardWrapper;

    // this.initializeAnalytics();
    // this.initializeIframeBorderToggle();

    Conductor.services['configuration'] = ConfigurationService;
    Conductor.services['fullXhr'] = FullXhrService;

    conductor.loadData(cardUrl, cardId, {});
    card = conductor.load(cardUrl, cardId, { capabilities: ['fullXhr', 'configuration']});
    $cardWrapper = this.$("<div class='card-wrapper'>");

    this.$('.cards').append($cardWrapper);
    card.appendTo($cardWrapper[0]).then(function() {
      card.render();
    });
    // this.wiretapCard(card);
  }
});

export ApplicationView;
