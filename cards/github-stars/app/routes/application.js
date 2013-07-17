import card from 'card';
import Conductor from 'conductor';

var Stargazers = {
  getApiConsumer: function(user){
    return user ? card.consumers.authenticatedGithubApi : card.consumers.unauthenticatedGithubApi;
  },
  findByRepositoryName: function(repositoryName, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    return apiConsumer.request("ajax", {
      url: '/repos/' + repositoryName + '/stargazers?sort=updated',
      dataType: 'jsonp'
    }).then(function(stargazers) {
      if(stargazers.meta.Link) {
        var lastPageUrl = stargazers.meta.Link[1][0];
        return Stargazers.getTotal(lastPageUrl, user).then(function(total) {
          return {
            data: stargazers.data,
            total: total
          };
        });
      } else {
        return stargazers;
      }
    });
  },
  getTotal: function(last, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    var url = last.slice(last.indexOf('/repos'), last.indexOf('&callback')) + last.slice(last.indexOf('&page'));
    return apiConsumer.request("ajax", {
      url: url,
      dataType: 'json'
    }).then(function(lastPage) {
      var pages = Number(url.slice(url.indexOf('page=')+5));
      return (pages-1) * 30 + (lastPage.length);
    });
  },
  currentUserStarred: function(repositoryName, user) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!user) {
        resolve(false);
        return;
      }
      var apiConsumer = Stargazers.getApiConsumer(user);
      return apiConsumer.request("ajax", {
        url: '/user/starred/' + repositoryName,
        type: 'GET',
        dataType: 'json'
      }).then(function () {
        resolve(true);
      }, function (e) {
        return e.status === 404 ? resolve(false) : reject(e);
      });
    });
  },
  starRepository: function(repositoryName, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    return apiConsumer.request("ajax", {
      url: '/user/starred/' + repositoryName,
      type: 'PUT',
      dataType: 'json'
    });
  },
  unstarRepository: function(repositoryName, user) {
    var apiConsumer = Stargazers.getApiConsumer(user);
    return apiConsumer.request("ajax", {
      url: '/user/starred/' + repositoryName,
      type: 'DELETE',
      dataType: 'json'
    });
  }
};

var Repo = {
  getCurrentRepositoryName: function(){
    return Ember.RSVP.resolve(card.consumers.repository.request('getRepository'));
  }
};

function retrieveStargazers(user) {
  return Repo.getCurrentRepositoryName().then(function(repositoryName) {
    return Ember.RSVP.all([
      Stargazers.findByRepositoryName(repositoryName, user),
      Stargazers.currentUserStarred(repositoryName, user)
    ]).then(function (allResults) {
      return {
        user: user,
        repositoryName: repositoryName,
        stargazers: allResults[0].data,
        totalStargazers: allResults[0].total || allResults[0].data.length,
        isStarred: allResults[1]
      };
    });
  }).then(null, Conductor.error);
}

var ApplicationRoute = Ember.Route.extend({
  events: {
    currentUserChanged: function(user) {
      this.controller.set('user', user);
    },
    star: function(){
      var controller = this.controller,
          repository = controller.get('repositoryName'),
          user = controller.get('user');
      Stargazers.starRepository(repository, user).then(function(){
        controller.set('isStarred', true);
      });
    },
    unstar: function(){
      var controller = this.controller,
          repository = controller.get('repositoryName'),
          user = controller.get('user');
      Stargazers.unstarRepository(repository, user).then(function(){
        controller.set('isStarred', false);
      });
    }
  },
  model: function(){
    return card.consumers.identity.request("currentUser").then(function(user){
      return retrieveStargazers(user);
    });
  }
});

export default ApplicationRoute;
