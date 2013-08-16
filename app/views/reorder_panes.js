var ReorderPanesView = Ember.View.extend({
  classNames: ['reorder-panes'],
  didInsertElement: function(){
    this.applySortable();
  },
  applySortable: function(){
    var view = this;
    this.$('.sortable-list').sortable({items: 'li'}).on('sortupdate', function(){
      view.propertyWillChange('orderedIds');
      view.propertyDidChange('orderedIds');
    });
  },
  willDestroyElement: function(){
    this.$('.sortable-list').sortable('destroy');
  },
  orderedIds: function(){
    return this.$('li').map(function(){
      return this.attributes['data-pane-id'].value;
    }).toArray();
  }.property(),
  applyNewOrder: function(){
    this.get('controller').send('applyNewOrder', this.get('orderedIds'));
  }
});
export default ReorderPanesView;
