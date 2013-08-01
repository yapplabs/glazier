/*
 * PromiseProxyMixin provides a bindable root for a promise's
 * future value. The content property of the object is set to
 * the fulfilled value when the promise fulfills. Convenient
 * properties such as isLoading, isRejected, etc. are
 * available, too!
 */

var PromiseProxyMixin = Ember.Mixin.create({
  init: function(){
    this._super();
    var promise = Ember.get(this, 'promise');

    if (promise){
       this.setPromise(promise);
    }
  },
  isLoading: Ember.computed.not('isResolved'),
  isResolved: Ember.computed.or('isRejected', 'isFulfilled'),
  isRejected:  false,
  isFulfilled: false,
  setPromise: function(promise){
    var hasResolved = false;
    var hasFulfilled = false;
    var hasRejected = false;
    var proxy = this;

    this.promise = promise;

    return promise.then(function(value){
      Ember.set(proxy, 'isFulfilled', true);
      Ember.set(proxy, 'content', value);
    }, function(reason){
      Ember.set(proxy, 'isRejected', true);
      throw reason;
    }); // something needs to handle this.
  }
});

var PromiseObjectProxy = Ember.ObjectProxy.extend(PromiseProxyMixin, {});

var PromiseArrayProxy = Ember.ObjectProxy.extend(PromiseProxyMixin, {});

export { PromiseObjectProxy, PromiseArrayProxy, PromiseProxyMixin };
