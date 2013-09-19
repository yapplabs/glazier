import Conductor from 'conductor';
import ajax from 'glazier/utils/ajax';

/* Diagram: http://www.websequencediagrams.com/cgi-bin/cdraw?lz=Y2FyZCAtPiBjb25zdW1lcjogcmVxdWVzdDogYWpheChvcHRzKQoAFgggLT4gc2VydmljZQATFm5vdGUgcmlnaHQgb2YAIQoALQcgYXVnbWVudHMAVwUgXG5vcHRpb25zIHdpdGggQVBJIGhvc3RcbmFuZCBBdXRob3JpemF0aW9uIGhlYWRlcgoAQAgtPiBhcGkuZ2l0aHViLmNvbTogaHR0cACBNAgKAA8OAIEpDQAhB3Nwb25zZQBFDACBdgxzb2x2ZSBvciByZWplY3RcbncvAIEtBgAwCQCCBgxjYXJkABAm&s=roundgreen
   Put the following into websequencediagrams.com to regenerate:

    card -> consumer: request: ajax(opts)
    consumer -> service: request: ajax(opts)
    note right of service: service augments ajax \noptions with API host\nand Authorization header
    service -> api.github.com: http request
    api.github.com -> service: http response
    service -> consumer: resolve or reject\nw/ ajax response
    consumer -> card: resolve or reject\nw/ ajax response
*/

var AuthenticatedGithubApiService = Conductor.Oasis.Service.extend({

  accessToken: function() {
    return this.container.lookup('controller:user').get('accessToken');
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
        throw new Error('no github acccess token');
      }

      if (!ajaxOpts.data) {
        ajaxOpts.data = {};
      }

      var url = 'https://api.github.com' + ajaxOpts.url;
      ajaxOpts.beforeSend = function(xhr) {
        xhr.setRequestHeader('Authorization', "token " + accessToken);
      };

      return ajax(url, ajaxOpts).fail(failureResultFromJqXhr);
    }
  }
});

function failureResultFromJqXhr(reason){
  var parsedError = {
        responseText: reason.responseText,
        status: reason.status,
        rawHeaders: reason.headers
      };

  throw parsedError;
}

export default AuthenticatedGithubApiService;
