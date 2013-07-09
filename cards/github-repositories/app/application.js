import Resolver from 'resolver';

var App = Ember.Application.create({
  modulePrefix: 'app',
  rootElement: '#card',
  resolver: Resolver
});

App.deferReadiness();

requireModule('templates');

// TODO: pull the card data store out into a shared repo (github-people uses it)
var CardDataStore = Ember.Object.extend({
  dataDidChange: function(bucket, data) {
    var cardData;

    if (bucket === '*') {
      cardData = data;
    } else {
      cardData = {};
      cardData[bucket] = data;
    }
    this.setProperties(cardData);
  }
});

App.initializer({
  name: 'cardDataStore',
  initialize: function(container, application) {
    application.register('store:cardData', CardDataStore);
    application.inject('controller', 'cardDataStore', 'store:cardData');
    application.inject('route', 'cardDataStore', 'store:cardData');

    var card = container.lookup('card:main'),
        cardDataStore = container.lookup('store:cardData');
    // TODO: Could we hook into dataConsumer to do this instead of defining a method?
    if (card.didUpdateData) {
      throw new Error('card already defines didUpdateData');
    }
    card.didUpdateData = function(bucket, data) {
      cardDataStore.dataDidChange(bucket, data);
    };
    cardDataStore.dataDidChange('*', card.data);
  }
});


export default App;
