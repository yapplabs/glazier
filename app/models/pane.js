var Pane = DS.Model.extend({
  paneType: DS.belongsTo('pane_type'),
  section: DS.belongsTo('section'),
  position: DS.attr('number'),
  repository: DS.attr('string'),

  paneEntries: DS.attr('passthrough'), // github people - the list and each person
  paneUserEntries: DS.attr('passthrough'), // stackoverflow-auth, access token
  paneTypeUserEntries: DS.attr('passthrough'), //
  cardData: function() {
    return {
      paneEntries: this.get('paneEntries') || {},
      paneUserEntries: this.get('paneUserEntries') || {},
      paneTypeUserEntries: this.get('paneTypeUserEntries') || {},
      repositoryName: this.get('repository')
    };
  }.property('paneEntries', 'paneUserEntries', 'paneTypeUserEntries'),

  manifest: Ember.computed.alias('paneType.manifest'),
  displayName: Ember.computed.alias('paneType.displayName'),
  diplayCardTitle: function() {
    var cardTitle = this.get('cardTitle');
    if (cardTitle) { return cardTitle; }
    return this.get('displayName');
  }.property('displayName', 'cardTitle'),
  updatePaneEntry: function(key, value) {
    this.propertyWillChange('paneEntries');
    this.set('paneEntries.' + key, value);
    this.propertyDidChange('paneEntries');
  },
  removePaneEntry: function(key) {
    this.propertyWillChange('paneEntries');
    delete this.get('paneEntries')[key];
    this.propertyDidChange('paneEntries');
  },
  updatePaneUserEntry: function(key, value) {
    this.propertyWillChange('paneUserEntries');
    this.set('paneUserEntries.' + key, value);
    this.propertyDidChange('paneUserEntries');
  },
  removePaneUserEntry: function(key) {
    this.propertyWillChange('paneUserEntries');
    delete this.get('paneUserEntries')[key];
    this.propertyDidChange('paneUserEntries');
  },
  updatePaneTypeUserEntry: function(key, value) {
    this.propertyWillChange('paneTypeUserEntries');
    this.get('paneTypeUserEntries')[key] = value;
    this.propertyDidChange('paneTypeUserEntries');
  },
  removePaneTypeUserEntry: function(key) {
    this.propertyWillChange('paneTypeUserEntries');
    delete this.get('paneTypeUserEntries')[key];
    this.propertyDidChange('paneTypeUserEntries');
  }
});

Pane.reopenClass({
  sortPanesThatProvideServicesFirst: function(paneA, paneB) {
    var isPaneAProvider = !Ember.isEmpty(paneA.get('manifest.provides'));
    var isPaneBProvider = !Ember.isEmpty(paneB.get('manifest.provides'));
    if (isPaneAProvider === isPaneBProvider) return 0;
    if (isPaneAProvider > isPaneBProvider) {
      return -1;
    } else {
      return 1;
    }
  }
});

export default Pane;
