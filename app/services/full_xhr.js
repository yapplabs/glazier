var FullXhrService = Conductor.Oasis.Service.extend({

  /*
    @public

    @property requests
    @type Object
  */
  requests: {

    /*
      @public

      @method ajax
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param ajaxOpts {Object}
    */
    ajax: function(promise, ajaxOpts) {
      console.log('FullXhrService.ajax', ajaxOpts);
      Ember.$.ajax($.extend(ajaxOpts, {context: promise})).then(promise.resolve, promise.reject);
    }
  }
});

export = FullXhrService;
