import Application from 'glazier/application';

import Pane from 'glazier/models/pane';
import PaneType from 'glazier/models/pane_type';
import Section from 'glazier/models/section';
import Dashboard from 'glazier/models/dashboard';

import PaneView from 'glazier/views/pane';

import conductorServicesInitializer from 'glazier/initializers/conductor_services';
import injectionsInitializer from 'glazier/initializers/injections';

import autoFocusField from 'glazier/helpers/auto_focus_input';

Ember.TextField.reopen({
  attributeBindings: ['autofocus']
});

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.PaneType = PaneType;
Glazier.Section = Section;
Glazier.Dashboard = Dashboard;

Glazier.PaneView = PaneView;
Glazier.env = (/github\.glazier\.io/.test(window.location.hostname)) ? 'prod' : 'dev';

Ember.Application.initializer(injectionsInitializer);
Ember.Application.initializer(conductorServicesInitializer);

Ember.RSVP.configure('onerror', function(error) {
  Ember.Logger.assert(false, error);
});

export { Glazier };
