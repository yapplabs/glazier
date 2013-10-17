import CardManager from 'glazier/card_manager';
import CardDataManager from 'glazier/card_data_manager';

var initializer = {
  name: 'injections',
  initialize: function (container, application) {
    application.register('card-manager:main', CardManager, {singleton: false});
    application.register('card-data_manager:main', CardDataManager);

    application.inject('card-data-manager:main', 'userController', 'controller:user');
    application.inject('card-data-manager:main', 'repositoryController', 'controller:repository');

    application.inject('card-manager:main', 'cardDataManager', 'card-data-manager:main');
    application.inject('card-manager:main', 'store', 'store:main');

    application.inject('state-manager:section-navigation', 'router', 'router:main');
    application.inject('state-manager:section-navigation', 'store', 'store:main');

    application.inject('card-manager:main', 'conductor', 'conductor:main');
  }
};

export default initializer;

