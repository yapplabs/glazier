import 'glazier/application' as Application;

import 'glazier/card_manager'as CardManager;

import 'glazier/models/pane' as Pane;
import 'glazier/models/card_type' as CardType;
import 'glazier/models/dashboard' as Dashboard;
import 'glazier/models/capability_provider' as CapabilityProvider;

import 'glazier/initializers/conductor_services' as conductorServicesInitializer;
import 'glazier/initializers/github_auth_card' as githubAuthCardInitializer;
import 'glazier/fixtures' as Fixtures;

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.CapabilityProvider = CapabilityProvider;
Glazier.CardType = CardType;
Glazier.Dashboard = Dashboard;

Glazier.register('conductor:main', new Conductor(), { instantiate: false});
Glazier.register('cardManager:main', CardManager);

Glazier.inject('cardManager:main', 'conductor', 'conductor:main');

Ember.Application.initializer(conductorServicesInitializer);
Ember.Application.initializer(githubAuthCardInitializer);

export Glazier;
