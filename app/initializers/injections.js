import 'glazier/card_manager' as CardManager;
import 'conductor' as Conductor;

var initializer = {
  name: 'injections',
  initialize: function (container, application) {
    application.register('conductor:main', new Conductor(), { instantiate: false});
    application.register('cardManager:main', CardManager);

    application.inject('cardManager:main', 'conductor', 'conductor:main');
    application.inject('service:identity', 'userController', 'controller:user');
    application.inject('service:authenticatedGithubApi', 'userController', 'controller:user');
    application.inject('service:oauth', 'oauthController', 'controller:oauth');
  }
};

export = initializer;

