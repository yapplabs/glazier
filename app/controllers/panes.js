// content gets set via render helper {{render 'panes' <RecordArray>}}
var PanesController = Ember.ArrayController.extend({
  needs: ['dashboard/section'],
  sortProperties: ['position'],
  isAdmin: Ember.computed.alias('controllers.dashboard/section.isAdmin')
});

export default PanesController;
