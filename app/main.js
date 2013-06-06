import Application from 'glazier/application';
import ApplicationRoute from 'glazier/routes/application';
import IndexRoute from 'glazier/routes/index';
import DashboardRoute from 'glazier/routes/dashboard';
import DashboardView from 'glazier/views/dashboard';
import ApplicationView from 'glazier/views/application';
import CardManager from 'glazier/card_manager';
import ConfigurationService from 'glazier/services/configuration';
import RepositoryService from 'glazier/services/repository';
import FullXhrService from 'glazier/services/full_xhr';
import UserStorageService from 'glazier/services/user_storage';
import IdentityService from 'glazier/services/identity';
import Pane from 'glazier/models/pane';
import CapabilityProvider from 'glazier/models/capability_provider';
import CardType from 'glazier/models/card_type';
import Dashboard from 'glazier/models/dashboard';

import classFactory from 'glazier/utils/class_factory';


import 'glazier/initializers/conductor_services' as conductorServicesInitializer;
import 'glazier/initializers/github_auth_card' as githubAuthCardInitializer;
import 'glazier/fixtures' as Fixtures;

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.CapabilityProvider = CapabilityProvider;
Glazier.CardType = CardType;
Glazier.Dashboard = Dashboard;

Glazier.IndexRoute = IndexRoute;
Glazier.ApplicationRoute = ApplicationRoute;
Glazier.ApplicationView = ApplicationView;
Glazier.DashboardRoute = DashboardRoute;
Glazier.DashboardView = DashboardView;

Glazier.register('conductor:main', new Conductor(), { instantiate: false});
Glazier.register('cardManager:main', CardManager);

Glazier.inject('cardManager:main', 'conductor', 'conductor:main');

Glazier.register('service:configuration', classFactory(ConfigurationService));
Glazier.register('service:fullXhr', classFactory(FullXhrService));
Glazier.register('service:userStorage', classFactory(UserStorageService));
Glazier.register('service:identity', classFactory(IdentityService));
Glazier.register('service:repository', classFactory(RepositoryService));

Ember.Application.initializer(conductorServicesInitializer);
Ember.Application.initializer(githubAuthCardInitializer);

export Glazier;
