import Application from 'glazier/application';

import Pane from 'glazier/models/pane';
import PaneType from 'glazier/models/pane_type';
import Dashboard from 'glazier/models/dashboard';

import PaneView from 'glazier/views/pane';

import conductorServicesInitializer from 'glazier/initializers/conductor_services';
import injectionsInitializer from 'glazier/initializers/injections';

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.PaneType = PaneType;
Glazier.Dashboard = Dashboard;

Glazier.PaneView = PaneView;

Ember.Application.initializer(injectionsInitializer);
Ember.Application.initializer(conductorServicesInitializer);

Conductor.Oasis.configure('eventCallback', Ember.run);

export { Glazier };
