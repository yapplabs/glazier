import Application from 'glazier/application';

import Pane from 'glazier/models/pane';
import PaneType from 'glazier/models/pane_type';
import Section from 'glazier/models/section';
import Dashboard from 'glazier/models/dashboard';

import PaneView from 'glazier/views/pane';

import conductorServicesInitializer from 'glazier/initializers/conductor_services';
import conductorAnalyticsInitializer from 'glazier/initializers/conductor_analytics';
import injectionsInitializer from 'glazier/initializers/injections';

if (requirejs._eak_seen.ziniki) {
  var zinikiInitializer = require('glazier/initializers/ziniki');
  Application.initializer(zinikiInitializer);
}

Ember.TextField.reopen({
  attributeBindings: ['autofocus']
});

var resolveHelper = Ember.Handlebars.resolveHelper;
Ember.Handlebars.resolveHelper = function(container, name) {

  if (!container || name.indexOf('-') === -1) {
    return;
  }


  var helper = resolveHelper(container, name);
  if (helper) {
    return helper;
  }

  var template = container.lookup('template:' + name);
  return template && function(options) {
    template(this, { data: options.data });
  };
};

var Glazier = Application.create();

Glazier.Pane = Pane;
Glazier.PaneType = PaneType;
Glazier.Section = Section;
Glazier.Dashboard = Dashboard;

Glazier.PaneView = PaneView;
Glazier.env = (/github\.glazier\.io/.test(window.location.hostname)) ? 'prod' : 'dev';

Application.initializer(injectionsInitializer);
Application.initializer(conductorAnalyticsInitializer);
Application.initializer(conductorServicesInitializer);

Ember.RSVP.configure('onerror', function(error) {
  Ember.Logger.assert(false, error);
});

export { Glazier };
