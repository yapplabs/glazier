var ReorderableSectionsView = Ember.CollectionView.extend({
  tagName: 'ol',

  applySortable: function() {
    var view = this;
    this.$().sortable({items: 'li'}).on('sortupdate', function(event, ui) {

      var oldIndex = 0,
          changedItemId = ui.item.attr('id'),
          childViews = view._childViews;
      for (; oldIndex < childViews.length; ++oldIndex) {
        var childView = childViews[oldIndex];

        if (childView.elementId === changedItemId) {
          break;
        }
      }

      var newIndex = view.$('li#' + changedItemId).index();

      Ember.run(function() {
        view._updating = true;

        var content = view.get('content');
        var movedItem = content.objectAt(oldIndex);
        content.removeAt(oldIndex);
        content.insertAt(newIndex, movedItem);

        var movedView = childViews[oldIndex];
        childViews.removeAt(oldIndex);
        childViews.insertAt(newIndex, movedView);

        childViews.forEach(function(view, index) {
          var content = view.get('content');
          content.set('position', index);
        });

        view._updating = false;
      });
    });
  },

  _updating: false,

  arrayWillChange: function(content, start, removedCount) {
    if (!this._updating) {
      if (this.state === 'inDOM') {
        this.$().sortable('destroy');
      }
      this._super(content, start, removedCount);
    }
  },

  arrayDidChange: function(content, start, removed, added) {
    if (!this._updating) {
      this._super(content, start, removed, added);
      Ember.run.scheduleOnce('afterRender', this, 'applySortable');
    }
  }
});

export default ReorderableSectionsView;
/*
var ReorderPanesView = Ember.View.extend({
  classNames: ['reorder-panes'],
  applySortable: function(){
    var view = this;
    this.$('.sortable-list').sortable({items: 'li'}).on('sortupdate', function(){
      view.propertyWillChange('orderedIds');
      view.propertyDidChange('orderedIds');
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
 */
