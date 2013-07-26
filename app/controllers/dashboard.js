var DashboardController = Ember.ObjectController.extend({
  needs: ['user'],
  user: Ember.computed.alias('controllers.user'),
  repositoryName: Ember.computed.alias('id'),

  canAddPanes: function() {
    return this.get('isAdmin') && !this.get('addingPane');
  }.property('isAdmin', 'addingPane'),

  isAdmin: function() {
    var user = this.get('user.content'),
      repositoryName = this.get('repositoryName'),
      repos = user && user.editable_repositories;
    return repos && repos.indexOf(repositoryName) !== -1;
  }.property('user.content', 'repositoryName'),

  paneTypes: function() {
    return this.get('store').find(Glazier.PaneType);
  }.property(),

  addablePaneTypes: function() {
    var paneTypes = this.get('paneTypes');
    var panes = this.get('panes');

    return this.get('store').filter(Glazier.PaneType, function(paneType) {
      var isProvider = paneType.get('isProvider'),
        hasUI = paneType.get('hasUI');

      if (hasUI) {
        if (isProvider) {
          return !panes.someProperty('paneType', paneType);
        }
        return true;
      }
    });
  }.property('panes.[]'),

  addingPane: false,

  toggleAddingPanes: function() {
    this.toggleProperty('addingPane');
  },

  addPane: function(paneType) {
    var store = this.get('store');
    var dependencies = this.paneTypesToAdd(paneType);
    var transaction = store.transaction();
    // TODO: make recursively handle dependencies. (YAGNI?)
    if (dependencies) {
      dependencies.forEach(function(paneType) {
        transaction.createRecord(Glazier.Pane, {
          dashboard: this.get('content'),
          paneType: paneType
        });
      }, this);
    }

    transaction.createRecord(Glazier.Pane, {
      dashboard: this.get('content'),
      paneType: paneType
    });

    transaction.commit();
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
  },

  removePane: function(pane) {
    if (window.confirm('Are you sure you want to remove ' + pane.get('manifest.displayName') + '?')) {
      pane.deleteRecord();
      pane.store.commit();
    }
  }
});
export default DashboardController;
