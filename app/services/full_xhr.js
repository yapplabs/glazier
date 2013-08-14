import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

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
      var url = ajaxOpts.url;
      delete ajaxOpts.url;

      return ajax(url, ajaxOpts);
    }
  }
});

export default FullXhrService;
