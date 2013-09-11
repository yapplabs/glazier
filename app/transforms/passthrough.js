var PassthroughTransform = DS.Transform.extend({
  deserialize: function (serialized) {
    return serialized;
  },
  serialize: function(deserialized) {
    return deserialized;
  }
});

export default PassthroughTransform;
