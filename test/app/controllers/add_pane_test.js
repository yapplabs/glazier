import AddPaneController from 'glazier/controllers/add_pane';

import PaneType from 'glazier/models/pane_type';
import Pane from 'glazier/models/pane';
import Section from 'glazier/models/section';
import Dashboard from 'glazier/models/dashboard';
import DashboardController from 'glazier/controllers/dashboard';
import DashboardSectionController from 'glazier/controllers/dashboard/section';
import CardManager from 'glazier/card_manager';
import Conductor from 'conductor';
import ApplicationAdapter from 'glazier/adapters/application';

var addPaneController, dashboardSectionController, store;

module("AddPaneController", {
  setup: function() {
    var container = new Ember.Container();
    container.register('adapter:application', ApplicationAdapter);
    container.register('model:pane_type', PaneType);
    container.register('model:pane', Pane);
    container.register('model:section', Section);
    container.register('model:dashboard', Dashboard);
    container.register('store:main', DS.Store);
    store = container.lookup('store:main');

    store.push('pane_type', {
      id: 'glazier-stackoverflow-auth',
      manifest: JSON.stringify({
        cardUrl: '/cards/glazier-stackoverflow-auth/card.js',
        consumes: ['fullXhr'],
        provides: ['authenticatedStackoverflowApi']
      })
    });

    store.push('pane', {
      id: '7f878b1a-34af-42ed-b477-878721cbc90d',
      dashboard_id: 'emberjs/ember.js',
      pane_type_id: 'glazier-stackoverflow-auth'
    });


    store.push('pane_type', {
      id: 'glazier-stackoverflow-questions',
      manifest: {
        cardUrl: '/cards/glazier-stackoverflow-questions/card.js',
        consumes: ['authenticatedStackoverflowApi']
      }
    });

    store.push('pane', {
      id: '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2',
      dashboard_id: 'emberjs/ember.js',
      pane_type_id: 'glazier-stackoverflow-questions'
    });

    var questionsPane = store.find('pane', '1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2');
    var authPane = store.find('pane', '7f878b1a-34af-42ed-b477-878721cbc90d');

    container.register('card_manager:main', CardManager);
    container.register('controller:user', Ember.Controller.extend());
    container.register('controller:dashboard', DashboardController);
    container.register('controller:dashboard/section', DashboardSectionController);
    container.register('controller:paneTypes', Ember.ArrayController.extend());
    container.register('controller:clipboard', Ember.Controller.extend());
    container.register('controller:add_pane', AddPaneController);

    addPaneController = container.lookup('controller:add_pane');
    dashboardSectionController = container.lookup('controller:dashboard/section');
  },
  teardown: function() {
    addPaneController = null;
    dashboardSectionController = null;
    Ember.run(function() {
      store.destroy();
      store = null;
    });
  }
});

asyncTest("No auth pane required to add second questions pane", function() {
  store.push('section', {
    id: '1',
    pane_ids: ['1eaa0cb9-45a6-4720-a3bb-f2f69c5602a2', '7f878b1a-34af-42ed-b477-878721cbc90d']
  });
  var section = store.find('section', '1');
  section.then(function(section){
    dashboardSectionController.set('content', section);

    var questionsPaneType = store.find('pane_type', 'glazier-stackoverflow-questions');
    return questionsPaneType.then(function(questionsPaneType){
      start();
      var dependencies = dashboardSectionController.paneTypesToAdd(questionsPaneType);
      equal(dependencies.length, 0, "all dependencies are already in the section's panes");
    });
  }).then(null, Conductor.error);
});


// test("With a dashboard with no panes, the auth pane is a dependency", function() {
//   store.push('dashboard', {id: 'emberjs/ember.js'});
//   var dashboard = store.find(Dashboard, 'emberjs/ember.js');
//   dashboardController.set('content', dashboard);


//   var authPaneType = store.find(PaneType, 'glazier-stackoverflow-auth');
//   var questionsPaneType = store.find(PaneType, 'glazier-stackoverflow-questions');
//   var dependencies = addPaneController.paneTypesToAdd(questionsPaneType);
//   equal(dependencies[0], authPaneType, "the auth pane is a dependency");
// });
