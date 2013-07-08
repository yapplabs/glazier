import Application from 'glazier/application';

import Pane from 'glazier/models/pane';
import CardManifest from 'glazier/models/card_manifest';
import Dashboard from 'glazier/models/dashboard';
import CapabilityProvider from 'glazier/models/capability_provider';

import PaneView from 'glazier/views/pane';

import conductorServicesInitializer from 'glazier/initializers/conductor_services';
import injectionsInitializer from 'glazier/initializers/injections';

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.CapabilityProvider = CapabilityProvider;
Glazier.CardManifest = CardManifest;
Glazier.Dashboard = Dashboard;

Glazier.PaneView = PaneView;

Ember.Application.initializer(injectionsInitializer);
Ember.Application.initializer(conductorServicesInitializer);

export { Glazier };
