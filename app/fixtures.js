import Pane from 'glazier/models/pane';
import CapabilityProvider from 'glazier/models/capability_provider';
import CardType from 'glazier/models/card_type';
import Dashboard from 'glazier/models/dashboard';

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

Pane.FIXTURES = [
  {
    id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2',
    type: '/cards/github-repositories/manifest.json',
    capabilityProviders: ['1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2,7f878b1a-34af-42ed-b477-878721cbc90d']
  },
  {
    id: 'd30608af-11d8-402f-80a3-1f458650dbef',
    type: '/cards/github-repositories/manifest.json',
    capabilityProviders: ['d30608af-11d8-402f-80a3-1f458650dbef,7f878b1a-34af-42ed-b477-878721cbc90d']
  }
];

CapabilityProvider.FIXTURES = [
  {
    id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2,7f878b1a-34af-42ed-b477-878721cbc90d',
    capability: 'github:authenticated:read',
    provider: '7f878b1a-34af-42ed-b477-878721cbc90d'
  },
  {
    id: 'd30608af-11d8-402f-80a3-1f458650dbef,7f878b1a-34af-42ed-b477-878721cbc90d',
    capability: 'github:authenticated:read',
    provider: '7f878b1a-34af-42ed-b477-878721cbc90d'
  }
];

CardType.FIXTURES = [
  {
    id: '/cards/github-repositories/manifest.json',
    manifest: {
      jsUrl: '/cards/github-repositories/all.js',
      consumes: [ 'github:authenticated:read' ]
    }
  }
];
