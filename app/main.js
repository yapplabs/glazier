import 'glazier/application' as Application;

import 'glazier/models/pane' as Pane;
import 'glazier/models/card_manifest' as CardManifest;
import 'glazier/models/dashboard' as Dashboard;
import 'glazier/models/capability_provider' as CapabilityProvider;

import 'glazier/views/pane' as PaneView;

import 'glazier/initializers/conductor_services' as conductorServicesInitializer;
import 'glazier/initializers/injections' as injectionsInitializer;

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.CapabilityProvider = CapabilityProvider;
Glazier.CardManifest = CardManifest;
Glazier.Dashboard = Dashboard;

Glazier.PaneView = PaneView;

Ember.Application.initializer(injectionsInitializer);
Ember.Application.initializer(conductorServicesInitializer);

export Glazier;
