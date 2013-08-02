import CardManager from 'glazier/card_manager';
import CardDataManager from 'glazier/card_data_manager';
import Conductor from 'conductor';

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

    application.register('cardManager:main', CardManager, {singleton: false});
    application.register('cardDataManager:main', CardDataManager);

    application.inject('cardDataManager:main', 'userController', 'controller:user');
    application.inject('cardDataManager:main', 'repositoryController', 'controller:repository');

    application.inject('cardManager:main', 'cardDataManager', 'cardDataManager:main');

    application.inject('cardManager:main', 'conductor', 'conductor:main');
    application.inject('service:identity', 'userController', 'controller:user');
    application.inject('service:authenticatedGithubApi', 'userController', 'controller:user');
    application.inject('service:oauth', 'oauthController', 'controller:oauth');
  }
};

export default initializer;

