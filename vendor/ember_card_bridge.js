Ember.onLoad('Ember.Application', function(Application){
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

  Application.initializer({
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
});
