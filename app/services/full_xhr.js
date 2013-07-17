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
      return Ember.$.ajax(ajaxOpts);
    }
  }
});

export default FullXhrService;
