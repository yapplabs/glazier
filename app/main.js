import 'glazier/application' as Application;

import 'glazier/models/pane' as Pane;
import 'glazier/models/card_type' as CardType;
import 'glazier/models/dashboard' as Dashboard;
import 'glazier/models/capability_provider' as CapabilityProvider;

import 'glazier/initializers/conductor_services' as conductorServicesInitializer;
import 'glazier/initializers/injections' as injectionsInitializer;
import 'glazier/fixtures' as Fixtures;

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.CapabilityProvider = CapabilityProvider;
Glazier.CardType = CardType;
Glazier.Dashboard = Dashboard;

Ember.Application.initializer(injectionsInitializer);
Ember.Application.initializer(conductorServicesInitializer);

export Glazier;
