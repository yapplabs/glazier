import ApplicationView from 'glazier/views/application';
import ApplicationController from 'glazier/controllers/application';

var Glazier = Ember.Application.create();
Glazier.ApplicationView = ApplicationView;
Glazier.ApplicationController = ApplicationController;

Glazier.register('conductor:main', new Conductor(), { instantiate: false});

export Glazier;


import ConfigurationService from 'glazier/services/configuration';
import FullXhrService from 'glazier/services/full_xhr';
import CredentialedGithubApiService from 'glazier/services/credentialed_github_api';

Conductor.services['configuration'] = ConfigurationService;
Conductor.services['fullXhr'] = FullXhrService;
Conductor.services['credentialedGithubApi'] = CredentialedGithubApiService;

