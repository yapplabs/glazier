import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

/*
  Provides unauthenticated github api access

  @class UnauthenticatedGithubApiConsumer
*/
var UnauthenticatedGithubApiService = Conductor.Oasis.Service.extend({

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
    ajax: function (ajaxOpts) {
      var card = this.card;

      ajaxOpts.data = ajaxOpts.data = {};

      var url = 'https://api.github.com' + ajaxOpts.url;

      delete ajaxOpts.url;
      delete ajaxOpts.data.access_token;

      return ajax(url, ajaxOpts).then(null, failureResultFromJqXhr);
    }
  }
});

function failureResultFromJqXhr(failureTriple){
  var jqXhr = failureTriple[0],
      parsedError = {
        responseText: jqXhr.responseText,
        status: jqXhr.status,
        rawHeaders: jqXhr.getAllResponseHeaders()
      };

  throw parsedError;
}

export default UnauthenticatedGithubApiService;
