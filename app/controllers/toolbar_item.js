var get = Ember.get;
var ToolbarItemController = Ember.ObjectController.extend({
  iconClass: Ember.computed('icon', function(){
    return "icon-" + get(this, 'icon');
  })
});

export default ToolbarItemController;

