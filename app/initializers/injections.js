import 'glazier/card_manager' as CardManager;
import 'conductor' as Conductor;

function conductorUrl(){
  var url = $("meta[name='glazier-conductor-url']").attr('content');
  if (Ember.isNone(url)) {
    throw new Error("Missing Glazier Conductor url");
  }
  return url;
}

var initializer = {
  name: 'injections',
  initialize: function (container, application) {

    application.register('conductor:main', new Conductor({
      conductorURL: conductorUrl()
    }), { instantiate: false});

    application.register('cardManager:main', CardManager);

    application.inject('cardManager:main', 'conductor', 'conductor:main');
    application.inject('service:identity', 'userController', 'controller:user');
    application.inject('service:authenticatedGithubApi', 'userController', 'controller:user');
    application.inject('service:oauth', 'oauthController', 'controller:oauth');
  }
};

export = initializer;

