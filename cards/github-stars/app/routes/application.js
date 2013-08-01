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
      if (stargazers.meta.Link) {
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
    }).then(function(lastPageStargazers) {
      var pageCount = parseInt(url.slice(url.indexOf('page=') + 5), 10) - 1;
      var total = pageCount * 30 + lastPageStargazers.length;

      if(total > 999) {
        return (Math.floor(total / 100) / 10) + 'k';
      } else {
        return total;
      }
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

function retrieveStargazers(user) {
  var repositoryName = card.data.repositoryName;

  return Ember.RSVP.hash({
    stargazers: Stargazers.findByRepositoryName(repositoryName, user),
    isStarred: Stargazers.currentUserStarred(repositoryName, user)
  }).then(function (hash) {
    var stargazers = hash.stargazers;
    return {
      user: user,
      repositoryName: repositoryName,
      stargazers: stargazers.data,
      totalStargazers: stargazers.total || stargazers.data.length,
      isStarred: hash.isStarred
    };
  }).then(null, Conductor.error);
}

var ApplicationRoute = Ember.Route.extend({
  refreshStargazers: function() {
    var controller = this.controller,
        repository = controller.get('repositoryName'),
        user = controller.get('user');

    return Stargazers.findByRepositoryName(repository, user).then(function(stargazers) {
      controller.set('model.stargazers', stargazers.data);
      controller.set('model.totalStargazers', stargazers.total || stargazers.data.length);
    });
  },
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
      }).then($.proxy(this.refreshStargazers, this)).then(null, Conductor.error);
    },
    unstar: function(){
      var controller = this.controller,
          repository = controller.get('repositoryName'),
          user = controller.get('user');
      Stargazers.unstarRepository(repository, user).then(function(){
        controller.set('isStarred', false);
      }).then($.proxy(this.refreshStargazers, this)).then(null, Conductor.error);
    }
  },
  model: function(){
    return retrieveStargazers(card.data.user);
  }
});

export default ApplicationRoute;
