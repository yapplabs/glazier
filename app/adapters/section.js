import ApplicationAdapter from 'glazier/adapters/application';

var SectionAdapter = ApplicationAdapter.extend({
  persistSections: function(sections) {
    sections.forEach(function(section) {
      section.adapterWillCommit();
      section._inFlightAttributes = section._attributes;
      section._attributes = {};
    });

    this.ajax(this.buildURL("section", "update_all"), "PUT", {
      data: {
        sections: sections.map(function(section){
          return section.serialize({includeId: true});
        })
      }
    }).then(function() {
      sections.forEach(function(section) {
        section.adapterDidCommit();
      });
    }).then(null, function(reason) {
      Ember.Logger.error("Error persisting sections:");
      Ember.Logger.error(reason);
    });
  }
});

export default SectionAdapter;
