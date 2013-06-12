import Application from 'glazier/application';

import CardManager from 'glazier/card_manager';
import Pane from 'glazier/models/pane';
import CapabilityProvider from 'glazier/models/capability_provider';
import CardType from 'glazier/models/card_type';
import Dashboard from 'glazier/models/dashboard';

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
