import Section from 'glazier/models/section';

var Dashboard = DS.Model.extend({
  sections: DS.hasMany('Glazier.Section'),
  createSection: function(attributes) {
    var store = this.get('store');
    var transaction = store.transaction();

    var section = transaction.createRecord(Glazier.Section, {
      dashboard: this,
      name: attributes.name,
      containerType: attributes.containerType,
      position: this.nextSectionPosition(),
      slug: Section.sluggerize(attributes.name)
    });

    transaction.commit();
    return section;
  },
  nextSectionPosition: function() {
    return this.get('sections.length');
  },
  removeSection: function(section) {
    var store = this.get('store');
    var transaction = store.transaction();
    transaction.add(section);
    section.get('panes').forEach(function(pane) {
      pane.unloadRecord();
    });
    section.deleteRecord();
    transaction.commit();
  }
});

export default Dashboard;
