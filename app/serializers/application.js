var ApplicationSerializer = DS.RESTSerializer.extend({
  normalizePayload: function(type, payload) {
    Ember.keys(payload).filter(function(key) {
      return key.indexOf('_') !== -1;
    }).map(function(key) {
      payload[Ember.String.camelize(key)] = payload[key];
      delete payload[key];
    });
    return this._super(type, payload);
  },

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

