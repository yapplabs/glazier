var JsonTransform = DS.Transform.extend({
  deserialize: function (serialized) {
    return JSON.parse(serialized);
  },
  serialize: function(deserialized) {
    return JSON.stringify(deserialized);
  }
});

export default JsonTransform;
