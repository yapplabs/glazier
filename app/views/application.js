
var ApplicationView = Ember.View.extend({
  conductor: function(){
    return this.get('container').lookup('conductor:main');
  }.property(),
  didInsertElement: function() {
    this.loadCard(
      '/cards/github-auth/card.js', 1,
      [ 'fullXhr', 'configuration' ]
    );
    this.loadCard(
      '/cards/github-repositories/card.js', 2,
      [ 'credentialedGithubApi' ]
    );

    // this.initializeAnalytics();
    // this.initializeIframeBorderToggle();

    // this.wiretapCard(card);
  },
  loadCard: function(cardUrl, cardId, capabilities){
    var conductor = this.get('conductor'),
        card, $cardWrapper;
    conductor.loadData(cardUrl, cardId, {});
    card = conductor.load(cardUrl, cardId, { capabilities: capabilities});
    $cardWrapper = this.$("<div class='card-wrapper'>");

    this.$('.cards').append($cardWrapper);
    card.appendTo($cardWrapper[0]).then(function() {
      card.render();
    });
  }
});

export ApplicationView;
