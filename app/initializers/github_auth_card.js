import 'glazier/models/pane' as Pane;
import 'glazier/models/card_type' as CardType;

var initializer = {
  name: 'github_auth_card',
  after: 'store',
  initialize: function (container, application) {
    var store = container.lookup('store:main');
    store.load(CardType, '/cards/github-auth/manifest.json', {
      manifest: {
        jsUrl: '/cards/github-auth.js',
        consumes: [ 'fullXhr', 'configuration', 'userStorage', 'login' ],
        provides: ['github:authenticated:read']
      }
    });
    store.load(Pane, '7f878b1a-34af-42ed-b477-878721cbc90d', {
      type: '/cards/github-auth/manifest.json'
    });
  }
};

export = initializer;
