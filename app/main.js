import Application from 'glazier/application';
import DashboardRoute from 'glazier/routes/dashboard';
import DashboardView from 'glazier/views/dashboard';
import CardRegistry from 'glazier/card_registry';
import ConfigurationService from 'glazier/services/configuration';
import FullXhrService from 'glazier/services/full_xhr';
import UserStorageService from 'glazier/services/user_storage';
import IdentityService from 'glazier/services/identity';

var Glazier = Application.create();

Glazier.DashboardRoute = DashboardRoute;
Glazier.DashboardView = DashboardView;

var conductor = new Conductor();
var cardRegistry = new CardRegistry(conductor);

Glazier.register('conductor:main', conductor, { instantiate: false});
Glazier.register('cardRegistry:main', cardRegistry, { instantiate: false});


Conductor.services['configuration'] = ConfigurationService;
Conductor.services['fullXhr'] = FullXhrService;
Conductor.services['userStorage'] = UserStorageService;
Conductor.services['identity'] = IdentityService;

export Glazier;
