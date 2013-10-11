var ReorderableSectionsItemView = Ember.View.extend({
  tagName: 'li',
  templateName: 'section_item',
  attributeBindings: 'draggable',
  draggable: 'true',
  contextBinding: 'content',
  isCurrent: true
});

export default ReorderableSectionsItemView;
