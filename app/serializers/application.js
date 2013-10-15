// this file is overriden by ziniki

var ApplicationSerializer = DS.RESTSerializer.extend({
  keyForAttribute: function(attr) {
    return Ember.String.underscore(attr);
  },

  keyForRelationship: function(key, relationshipKind) {
    if (relationshipKind === "hasMany") {
      return Ember.String.singularize(Ember.String.underscore(key)) + "_ids";
    } else {
      return Ember.String.underscore(key) + "_id";
    }
  }
});

export default ApplicationSerializer;

