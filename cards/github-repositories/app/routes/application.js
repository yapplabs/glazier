function rejectionHandler(reason) {
  console.error(reason);
  console.assert(reason);

  throw reason;
}

import 'card' as card;

var ApplicationRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);

    var repositoryService = card.consumers['repository'];
    var currentRepoRequest = repositoryService.request('getRepository');

    currentRepoRequest.then(function(repoName) {
      controller.set('currentRepository', repoName);
    }).then(null, rejectionHandler);
  },

  model: function(){
    var _apiService = card.consumers['github:authenticated:read'];
    return _apiService.request("ajax", {
      url: '/user/repos',
      dataType: 'json'
    });
  }
});

export = ApplicationRoute;
