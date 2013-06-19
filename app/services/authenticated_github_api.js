import 'conductor' as Conductor;

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
      @param promise {Conductor.Oasis.RSVP.Promise}
      @param ajaxOpts {Object}
    */
    ajax: function(promise, ajaxOpts) {
      var accessToken = this.accessToken();
      if (!accessToken) {
        promise.reject();
        return;
      }

      if (!ajaxOpts.data) {
        ajaxOpts.data = {};
      }

      ajaxOpts.url = 'https://api.github.com' + ajaxOpts.url;
      ajaxOpts.beforeSend = function(xhr){
        xhr.setRequestHeader('Authorization', "token #{accessToken}");
      };
      console.log('AuthenticatedGithubApiService.ajax', ajaxOpts);

      $.ajax(ajaxOpts).then(function(value){
        promise.resolve(value);
      }).then(null, function(reason) {
        promise.reject(reason);
      });
    }
  }
});

export = AuthenticatedGithubApiService;
