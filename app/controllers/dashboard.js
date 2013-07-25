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
    return Glazier.PaneType.find();
  }.property(),

  addablePaneTypes: function() {
    var paneTypes = this.get('paneTypes');
    var panes = this.get('panes');

    return Glazier.PaneType.filter(function(paneType) {
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
    // search current panes for what they provide
    var consumes = paneType.get('manifest.consumes');
    var conductorServices = Conductor.services;
    var paneProvides = [];
    this.get('panes').forEach(function(pane) {
      var provides = pane.get('manifest.provides');
      if (provides && provides.length) {
        paneProvides = paneProvides.concat(provides);
      }
    });
    var dep, deps = [];
    var paneTypes = this.get('paneTypes');

    consumes.forEach(function(consume) {
      debugger;
      if (!paneProvides.contains(consume) && !conductorServices.hasOwnProperty(consume)) {
        dep = paneTypes.find(function(paneType) {
          var provides = paneType.get('manifest.provides');
          if (provides) {
            return provides.contains(consume);
          }
        });
        if (dep) {
          deps.push(dep);
        }
      }
    }, this);

    // TODO: make recursively handle dependencies. (YAGNI?)
    if (deps) {
      deps.forEach(function(paneType) {
        Glazier.Pane.createRecord({
          dashboard: this.get('content'),
          paneType: paneType
        });
      }, this);
    }

    var record = Glazier.Pane.createRecord({
      dashboard: this.get('content'),
      paneType: paneType
    });

    record.store.commit();
  },

  removePane: function(pane) {
    pane.deleteRecord();
    pane.store.commit();
  }
});
export default DashboardController;
