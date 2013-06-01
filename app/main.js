import ApplicationView from 'glazier/views/application';
import ApplicationController from 'glazier/controllers/application';

var Glazier = Ember.Application.create();
Glazier.ApplicationView = ApplicationView;
Glazier.ApplicationController = ApplicationController;

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
