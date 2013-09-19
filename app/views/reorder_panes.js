var ReorderPanesView = Ember.View.extend({
  classNames: ['reorder-panes'],
  applySortable: function(){
    var view = this;
    this.$('.sortable-list').sortable({items: 'li'}).on('sortupdate', function(){
      view.notifyPropertyChange('orderedIds');
    });
  }.on('didInsertElement'),
  willDestroyElement: function(){
    this.$('.sortable-list').sortable('destroy');
  },
  orderedIds: function(){
    return this.$('li').map(function(){
      return this.attributes['data-pane-id'].value;
    }).toArray();
  }.property().volatile()
});
export default ReorderPanesView;
