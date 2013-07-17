import Conductor from 'conductor';

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
      @param ajaxOpts {Object}
    */
    ajax: function(ajaxOpts) {
      console.log('FullXhrService.ajax', ajaxOpts);
      return Conductor.Oasis.RSVP.resolve(Ember.$.ajax(ajaxOpts)).then(function(data) {
        var x = ajaxOpts;
        return data;
      });
    }
  }
});

export default FullXhrService;
