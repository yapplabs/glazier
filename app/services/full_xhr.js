var FullXhrService = Conductor.Oasis.Service.extend({
  requests: {
    ajax: function(promise, ajaxOpts) {
      console.log('FullXhrService.ajax', ajaxOpts);
      Ember.$.ajax($.extend(ajaxOpts, {context: promise})).then(promise.resolve, promise.reject);
    }
  }
});

export FullXhrService;