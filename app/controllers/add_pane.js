var AddPaneController = Ember.ObjectController.extend({
  needs: ['dashboard'],
  content: Ember.computed.alias('controllers.dashboard.content'),

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

  addPane: function(paneType) {
    var store = this.get('store');
    var dependencies = this.paneTypesToAdd(paneType);
    var transaction = store.transaction();
    // TODO: make recursively handle dependencies. (YAGNI?)
    var dashboard = this.get('content');

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

export default AddPaneController;
