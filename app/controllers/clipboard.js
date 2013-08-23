var ClipboardController = Ember.ObjectController.extend({
  // content is a pane

  // TODO: grab live title if available
  paneName: Ember.computed.alias('paneType.displayName')
});

export default ClipboardController;
