import Conductor from 'conductor';

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

      ajaxOpts.url = 'https://api.github.com' + ajaxOpts.url;
      delete ajaxOpts.data.access_token;

      return Conductor.Oasis.RSVP.resolve($.ajax(ajaxOpts)).
        then(null, failureResultFromJqXhr);
    }
  }
});

function failureResultFromJqXhr(jqXhr){
  var parsedError = {
    responseText: jqXhr.responseText,
    status: jqXhr.status,
    rawHeaders: jqXhr.getAllResponseHeaders()
  };

  throw parsedError;
}

export default UnauthenticatedGithubApiService;
