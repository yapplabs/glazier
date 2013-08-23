var DashboardController = Ember.ObjectController.extend({
  needs: ['user'],
  user: Ember.computed.alias('controllers.user'),
  repositoryName: Ember.computed.alias('id'),
  hidePanes: false,
  isPerformingReorder: false,
  cardManager: null,

  scheduleSetupCardManager: function() {
    Ember.run.once(this, this.setupCardManager);
  }.observes('content', 'isPerformingReorder'),

  contentWillChange: function() {
    if (this.cardManager) {
      this.cardManager.destroy();
      this.cardManager = null;
    }
  }.observesBefore('content'),

  setupCardManager: function() {
    if (this.get('content')) {
      this.cardManager = this.container.lookup('cardManager:main');
      this.cardManager.setProviderCardCatalog(this.get('content'));
    }
  },

  isAdmin: function() {
    var user = this.get('user.content'),
      repositoryName = this.get('repositoryName'),
      repos = user && user.editable_repositories;
    return repos && repos.indexOf(repositoryName) !== -1;
  }.property('user.content', 'repositoryName'),

  removePane: function(pane) {
    if (window.confirm('Are you sure you want to remove ' + pane.get('displayName') + '?')) {
      pane.get('dashboard.panes').removeObject(pane);
      pane.deleteRecord();
      pane.store.commit();
      this.cardManager.unload(pane);
    }
  },

  addPane: function(paneType, repository) {
    var store = this.get('store');
    var dependencies = this.paneTypesToAdd(paneType);
    var transaction = store.transaction();
    // TODO: make recursively handle dependencies. (YAGNI?)
    var dashboard = this.get('content');

    repository = repository || this.get('id'); // default to dashboard id

    if (dependencies) {
      dependencies.forEach(function(paneType) {
        transaction.createRecord(Glazier.Pane, {
          dashboard: dashboard,
          paneType: paneType,
          position: dashboard.get('nextPanePosition')
        });
      }, this);
    }

    transaction.createRecord(Glazier.Pane, {
      dashboard: dashboard,
      paneType: paneType,
      repository: repository,
      position: dashboard.get('nextPanePosition')
    });

    transaction.commit();
    this.send('hideModal');

    this.scrollLastPaneIntoView();
  },

  scrollLastPaneIntoView: function() {
    // Scroll the new pane into view after for modal-close animation is done
    // Doing it sooner results in an odd scroll position
    Ember.run.later(this, function() {
      var lastPane = $('.pane').last();
      var scrollTop = lastPane.offset().top + lastPane.height();
      $('body').scrollTop(scrollTop);
    }, 500);
  },

  paneTypesToAdd: function(paneType) {
    var consumes = paneType.get('manifest.consumes');
    var conductorServices = Conductor.services;

    var paneProvides = [];
    this.get('panes').forEach(function(pane) {
      var provides = pane.get('manifest.provides');
      if (provides && provides.length) {
        paneProvides = paneProvides.concat(provides);
      }
    });
    var dep, dependencies = [];
    var paneTypes = this.get('paneTypes');

    consumes.forEach(function(consume) {
      if (!paneProvides.contains(consume) && !conductorServices.hasOwnProperty(consume)) {
        dep = paneTypes.find(function(paneType) {
          var provides = paneType.get('manifest.provides');
          if (provides) {
            return provides.contains(consume);
          }
        });
        if (dep) {
          dependencies.push(dep);
        }
      }
    }, this);

    return dependencies;
  }
});
export default DashboardController;
