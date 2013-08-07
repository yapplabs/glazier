Ember.onLoad('Ember.Application', function(Application){
  Conductor.Oasis.configure('eventCallback', Ember.run);

  Conductor.Oasis.RSVP.configure('async', function(callback, promise) {
    Ember.run.schedule('actions', promise, callback, promise);
  });

  function handleRenderIntent(intent, dimensions) {
    return function(app) {
      var router = app.__container__.lookup('router:main');

      if (intent) {
        var message = "render" + Ember.String.capitalize(intent);
        router.send(message, dimensions);
      }

      return router.router.activeTransition;
    };
  }

  Ember.Application.reopen({
    _renderHasBeenCalled: false,
    render: function(intent, dimensions) {
      if (!this._renderHasBeenCalled) {
        this._renderHasBeenCalled = true;
        Ember.run(this, 'advanceReadiness');
      }

      return this.then(handleRenderIntent(intent, dimensions))
    }
  });

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

  Application.initializer({
    name: 'registerConsumers',
    initialize: function(container, application) {
      var card = container.lookup('card:main');
      Ember.keys(Object.getPrototypeOf(card.consumers)).forEach(function(name){
        card.consumers[name].container = container;
        application.register('consumer:' + name, card.consumers[name], { instantiate: false });
      }, this);
    }
  });

  Application.initializer({
    name: 'remoteEmberObjectConsumer',
    after: 'registerConsumers',
    initialize: function(container, application) {
      var consumer = container.lookup('consumer:remoteEmberObject');
      if (!consumer) { return; }
      Ember.EnumerableUtils.forEach(consumer.controllers, function(name){
        var controller = container.lookup('controller:' + name);
        var bucket = {
          updateData: function(data) {
            consumer.updateData(name, data);
          }
        };
        controller.set('bucket', bucket);
      })
    }
  });
});

define("glazier/remote-ember-object-mixin",
  [],
  function() {
    return Ember.Mixin.create({
      bucket: null,
      init: function(){
        var thisArg = this;
        this._super();

        var publishedProperties = this.get('publishedProperties');

        // install observers for each publishedProperties
        Ember.EnumerableUtils.forEach(publishedProperties, function(propertyName){
          Ember.addObserver(thisArg, propertyName, function(){
            // schedule updateRemoteData for the bucket
            Ember.run.once(thisArg, '_updateData');
          });
        });
      },
      getBucketData: function(){
        return this.getProperties(this.get('publishedProperties'));
      },
      _updateData: function(){
        this.get('bucket').updateData(this.getBucketData());
      }
    });
  }
);
