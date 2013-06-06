import Application from 'glazier/application';
import ApplicationRoute from 'glazier/routes/application';
import IndexRoute from 'glazier/routes/index';
import DashboardRoute from 'glazier/routes/dashboard';
import DashboardView from 'glazier/views/dashboard';
import ApplicationView from 'glazier/views/application';
import CardManager from 'glazier/card_manager';
import ConfigurationService from 'glazier/services/configuration';
import FullXhrService from 'glazier/services/full_xhr';
import UserStorageService from 'glazier/services/user_storage';
import IdentityService from 'glazier/services/identity';
import Pane from 'glazier/models/pane';
import CapabilityProvider from 'glazier/models/capability_provider';
import CardType from 'glazier/models/card_type';
import Dashboard from 'glazier/models/dashboard';


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

var conductor = new Conductor();
var cardManager = new CardManager(conductor);

Glazier.register('conductor:main', conductor, { instantiate: false});
Glazier.register('cardManager:main', cardManager, { instantiate: false});


Conductor.services['configuration'] = ConfigurationService;
Conductor.services['fullXhr'] = FullXhrService;
Conductor.services['userStorage'] = UserStorageService;
Conductor.services['identity'] = IdentityService;

export Glazier;
