var ApplicationView = Ember.View.extend({
  conductor: function(){
    return this.get('container').lookup('conductor:main');
  }.property(),
  didInsertElement: function() {
    var cardRegistry = this.get('container').lookup('cardRegistry:main');
    cardRegistry.load('/cards/github-repositories/manifest.json');

    // this.loadCard(
    //   '/cards/github-auth/card.js', 1,
    //   [ 'fullXhr', 'configuration' ]
    // );
    // this.loadCard(
    //   '/cards/github-repositories/card.js', 2,
    //   [ 'github:authenticated:read' ]
    // );

    // this.initializeAnalytics();
    // this.initializeIframeBorderToggle();

    // this.wiretapCard(card);
  },
  addCard: function(card) {
    var $cardWrapper = this.$("<div class='card-wrapper'>");

    this.$('.cards').append($cardWrapper);
    card.appendTo($cardWrapper[0]).then(function() {
      card.render();
    });
  },
  loadCard: function(cardUrl, cardId, capabilities){
    var conductor = this.get('conductor'), card;
    conductor.loadData(cardUrl, cardId, {});
    card = conductor.load(cardUrl, cardId, { capabilities: capabilities});
    this.addCard(card);
  }
});

export ApplicationView;
