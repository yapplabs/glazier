var AutofocusTextField = Ember.TextField.extend({
  focusField: function() {
    Ember.run.later(this.$(), 'focus', 200);
  }.on('didInsertElement')
});

Ember.Handlebars.helper('autofocus-input', AutofocusTextField);

export default AutofocusTextField;
