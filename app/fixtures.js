import Pane from 'glazier/models/pane';
import CapabilityProvider from 'glazier/models/capability_provider';
import CardType from 'glazier/models/card_type';
import Dashboard from 'glazier/models/dashboard';

// github user names do not allow . so we use the first period as a delimiter to combine in an id
Dashboard.FIXTURES = [
  {
    id: 'emberjs/ember.js',
    panes: ['1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2', 'c37b0ba4-cecc-11e2-8fa4-ef3e5db78e4d']
  },
  {
    id: 'yapplabs/glazier',
    panes: ['d30608af-11d8-402f-80a3-1f458650dbef', 'dca13978-cecc-11e2-b9e3-e342ecfc2ff7']
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
  },
  {
    id: 'c37b0ba4-cecc-11e2-8fa4-ef3e5db78e4d',
    type: '/cards/github-issues/manifest.json',
    capabilityProviders: ['c37b0ba4-cecc-11e2-8fa4-ef3e5db78e4d,7f878b1a-34af-42ed-b477-878721cbc90d']
  },
  {
    id: 'dca13978-cecc-11e2-b9e3-e342ecfc2ff7',
    type: '/cards/github-issues/manifest.json',
    capabilityProviders: ['dca13978-cecc-11e2-b9e3-e342ecfc2ff7,7f878b1a-34af-42ed-b477-878721cbc90d']
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
  },
  {
    id: 'c37b0ba4-cecc-11e2-8fa4-ef3e5db78e4d,7f878b1a-34af-42ed-b477-878721cbc90d',
    capability: 'github:authenticated:read',
    provider: '7f878b1a-34af-42ed-b477-878721cbc90d'
  },
  {
    id: 'dca13978-cecc-11e2-b9e3-e342ecfc2ff7,7f878b1a-34af-42ed-b477-878721cbc90d',
    capability: 'github:authenticated:read',
    provider: '7f878b1a-34af-42ed-b477-878721cbc90d'
  }
];

CardType.FIXTURES = [
  {
    id: '/cards/github-repositories/manifest.json',
    manifest: {
      jsUrl: '/cards/github-repositories.js',
      consumes: [ 'github:authenticated:read', 'repository' ]
    }
  },
  {
    id: '/cards/github-issues/manifest.json',
    manifest: {
      jsUrl: '/cards/github-issues.js',
      consumes: [ 'github:authenticated:read', 'repository']
    }
  }
];
