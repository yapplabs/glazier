import ApplicationView from 'glazier/views/application';
import ApplicationController from 'glazier/controllers/application';

var Glazier = Ember.Application.create();
Glazier.ApplicationView = ApplicationView;
Glazier.ApplicationController = ApplicationController;
export Glazier;
