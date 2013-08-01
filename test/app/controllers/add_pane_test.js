import AddPaneController from 'glazier/controllers/add_pane';

import Dashboard from 'glazier/models/dashboard';
import Pane from 'glazier/models/pane';
import PaneType from 'glazier/models/pane_type';

import Conductor from 'conductor';

import Adapter from 'glazier/adapter';

var addPaneController, dashboardController, store;

module("AddPaneController", {
  setup: function() {
    store = DS.Store.create({
      adapter: Adapter
    });

    store.load(PaneType, 'glazier-stackoverflow-auth', {
      manifest: JSON.stringify({
        cardUrl: '/cards/glazier-stackoverflow-auth/card.js',
        consumes: ['fullXhr'],
        provides: ['authenticatedStackoverflowApi']
      })
    });

    store.load(Pane, '7f878b1a-34af-42ed-b477-878721cbc90d', {
      dashboard_id: 'emberjs/ember.js',
      pane_type_id: 'glazier-stackoverflow-auth'
    });


    store.load(PaneType, 'glazier-stackoverflow-questions', {
      manifest: JSON.stringify({
        cardUrl: '/cards/glazier-stackoverflow-questions/card.js',
        consumes: ['authenticatedStackoverflowApi']
      })
    });

    store.load(Pane, '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2', {
      dashboard_id: 'emberjs/ember.js',
      pane_type_id: 'glazier-stackoverflow-questions'
    });

    var questionsPane = store.find(Pane, '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2');
    var authPane = store.find(Pane, '7f878b1a-34af-42ed-b477-878721cbc90d');

    dashboardController = Ember.Controller.create();
    var container = new Ember.Container();
    container.cache.dict['controller:user'] = Ember.Controller.create();
    container.cache.dict['controller:dashboard'] = dashboardController;

    addPaneController = AddPaneController.create({
      needs: [],
      store: store,
      container: container
    });
  },
  teardown: function() {
    addPaneController = null;
    dashboardController = null;
    Ember.run(function() {
      store.destroy();
      store = null;
    });
  }
});

test("No auth pane required to add second questions pane", function() {
  store.load(Dashboard, 'emberjs/ember.js', {
    pane_ids: ['1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2', '7f878b1a-34af-42ed-b477-878721cbc90d']
  });
  var dashboard = store.find(Dashboard, 'emberjs/ember.js');
  dashboardController.set('content', dashboard);

  var questionsPaneType = store.find(PaneType, 'glazier-stackoverflow-questions');
  var dependencies = addPaneController.paneTypesToAdd(questionsPaneType);
  equal(dependencies.length, 0, "all dependencies are already in the dashboard's panes");
});


// test("With a dashboard with no panes, the auth pane is a dependency", function() {
//   store.load(Dashboard, 'emberjs/ember.js', {});
//   var dashboard = store.find(Dashboard, 'emberjs/ember.js');
//   dashboardController.set('content', dashboard);


//   var authPaneType = store.find(PaneType, 'glazier-stackoverflow-auth');
//   var questionsPaneType = store.find(PaneType, 'glazier-stackoverflow-questions');
//   var dependencies = addPaneController.paneTypesToAdd(questionsPaneType);
//   equal(dependencies[0], authPaneType, "the auth pane is a dependency");
// });
