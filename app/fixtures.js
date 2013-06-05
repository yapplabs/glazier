import Card from 'glazier/models/card';
import CardType from 'glazier/models/card_type';
import Dashboard from 'glazier/models/dashboard';

var FIXTURES = {};

// github user names do not allow . so we use the first period as a delimiter to combine in an id
Dashboard.FIXTURES = [
  {
    id: 'emberjs/ember.js',
    cards: ['1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2']
  },
  {
    id: 'yapplabs/glazier',
    cards: ['d30608af-11d8-402f-80a3-1f458650dbef']
  }
];

Card.FIXTURES = [
  {
    id: '7f878b1a-34af-42ed-b477-878721cbc90d',
    cardType: '/cards/github-auth/manifest.json'
  },
  {
    id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2',
    cardType: '/cards/github-repositories/manifest.json',
    consumes: ['7f878b1a-34af-42ed-b477-878721cbc90d']
  },
  {
    id: 'd30608af-11d8-402f-80a3-1f458650dbef',
    cardType: '/cards/github-repositories/manifest.json',
    consumes: ['7f878b1a-34af-42ed-b477-878721cbc90d']
  }
];

CardType.FIXTURES = [
  {
    id: '/cards/github-auth/manifest.json',
    manifest: {
      jsUrl: '/cards/github-auth/card.js',
      consumes: [ 'fullXhr', 'configuration', 'userStorage', 'identity' ],
      provides: ['github:authenticated:read']
    }
  },
  {
    id: '/cards/github-repositories/manifest.json',
    manifest: {
      jsUrl: '/cards/github-repositories/card.js',
      consumes: [ 'github:authenticated:read' ]
    }
  }
];

export FIXTURES;
