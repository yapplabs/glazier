import ReorderableSectionsView from 'glazier/views/reorderable_sections';
import ReorderableSectionsItemView from 'glazier/views/reorderable_sections_item';

var helper = function(content, options) {
  options.hash.itemViewClass = ReorderableSectionsItemView.extend({
    template: options.fn
  });
  delete options.fn;

  options.hash.contentBinding = content;

  return Ember.Handlebars.helpers.view.call(this, ReorderableSectionsView, options);
};

export default helper;
