import Conductor from 'conductor';

var AuthenticatedGithubApiService = Conductor.Oasis.Service.extend({

  accessToken: function(){
    return this.userController.get('accessToken');
  },
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
      var accessToken = this.accessToken();

      if (!accessToken) {
        throw new Error('no gthub acccess token');
      }

      if (!ajaxOpts.data) {
        ajaxOpts.data = {};
      }

      ajaxOpts.url = 'https://api.github.com' + ajaxOpts.url;
      ajaxOpts.beforeSend = function(xhr){
        xhr.setRequestHeader('Authorization', "token " + accessToken);
      };

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

export default AuthenticatedGithubApiService;
