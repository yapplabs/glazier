import ApplicationAdapter from 'glazier/adapters/application';

var PaneAdapter = ApplicationAdapter.extend({
  persistPanePositions: function(panes) {
    panes.forEach(function(pane) {
      pane.adapterWillCommit();
      pane._inFlightAttributes = pane._attributes;
      pane._attributes = {};
    });

    var pane_ids = panes.map(function(pane){
      return { id: pane.get('id'), position: pane.get('position') };
    }).sort(function(a,b){
      return a.position - b.position;
    }).map(function(paneData){ return paneData.id; });

    var data = {
      section_id: panes[0].get('section.id'),
      pane_ids: pane_ids
    };

    this.ajax(this.buildURL("pane", "reorder"), "POST", { data: data }).then(function() {
      panes.forEach(function(pane) {
        var data = Ember.$.extend({}, pane._data);
        data.position = pane.get('position');
        pane.adapterDidCommit(data);
      });
    }).then(null, function(reason) {
      Ember.Logger.error("Error persisting pane positions:");
      Ember.Logger.error(reason);
    });
  }
});

export default PaneAdapter;
