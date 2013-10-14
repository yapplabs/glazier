import Section from 'glazier/models/section';

var Dashboard = DS.Model.extend({
  sections: DS.hasMany('section', { async: true }),
  sortedSections: function(){
    return this.get('sections').sortBy('position');
  },
  createSection: function(attributes) {
    var store = this.get('store');

    var section = store.createRecord('section', {
      dashboard: this,
      name: attributes.name,
      containerType: attributes.containerType,
      position: this.nextSectionPosition(),
      slug: Section.sluggerize(attributes.name)
    });

    return section.save();
  },
  nextSectionPosition: function() {
    return this.get('sections.length');
  },
  removeSection: function(section) {
    var store = this.get('store');
    // toArray because the object changes as we iterate over it otherwise
    section.get('panes').toArray().forEach(function(pane) {
      pane.unloadRecord();
    });
    section.deleteRecord();
    return section.save();
  }
});

export default Dashboard;
