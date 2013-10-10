var helper = Ember.Handlebars.makeViewHelper(Ember.TextField.extend({
  focusField: function() {
    Ember.run.later(this.$(), 'focus', 500);
  }.on('didInsertElement')
}));

export default helper;
