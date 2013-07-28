// content gets set via render helper {{render 'panes' <RecordArray>}}
var PanesController = Ember.ArrayController.extend({
  sortProperties: ['position']
});

export default PanesController;
