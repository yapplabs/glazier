import ApplicationView from 'glazier/views/application';
import ApplicationController from 'glazier/controllers/application';

var Glazier = Ember.Application.create();
Glazier.ApplicationView = ApplicationView;
Glazier.ApplicationController = ApplicationController;

Glazier.Router.reopen({
  location: 'history'
});

Glazier.Router.map(function() {
  this.route('dashboard', { path: '/:github_user/:github_repo' });
});

Glazier.DashboardRoute = Ember.Route.extend({
  serialize: function (object, params) {
    var parts = object.split('/'),
        hash = {};
    Ember.assert(parts.length === 2 && params.length === 2, 'parts should equal params');
    hash[params[0]] = parts[0];
    hash[params[1]] = parts[1];
    return hash;
  },

  deserialize: function (hash) {
    return hash.github_user + '/' + hash.github_repo;
  }
});

import CardRegistry from 'glazier/card_registry';

var conductor = new Conductor();
var cardRegistry = new CardRegistry(conductor);

Glazier.register('conductor:main', conductor, { instantiate: false});
Glazier.register('cardRegistry:main', cardRegistry, { instantiate: false});

export Glazier;

import ConfigurationService from 'glazier/services/configuration';
import FullXhrService from 'glazier/services/full_xhr';
import UserStorageService from 'glazier/services/user_storage';
import IdentityService from 'glazier/services/identity';

Conductor.services['configuration'] = ConfigurationService;
Conductor.services['fullXhr'] = FullXhrService;
Conductor.services['userStorage'] = UserStorageService;
Conductor.services['identity'] = IdentityService;
