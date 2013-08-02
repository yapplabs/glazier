var PaneView = Ember.View.extend({
  templateName: 'pane',
  classNameBindings: [
    'controller.isHidden:hidden-pane:visible-pane',
    ':pane-wrapper',
    'fullSize'
  ],

  fullSize: Ember.computed.alias('controller.fullSize'),

  click: function(event) {
    var $target = $(event.target),
        isBackgroundClick = $target.closest('.pane').length === 0;

    if (isBackgroundClick && this.get('fullSize')) {
      this.collapse();
    }
  },

  toggleExpansion: function() {
    if (this.get('fullSize')) {
      this.collapse();
    } else {
      this.expand();
    }
  },

  expand: function(){
    var $paneWrapper = this.$();
    var $pane = $paneWrapper.children('.pane');

    $pane.css(this.originalPosition());

    Ember.run.scheduleOnce('afterRender', this, this.afterExpand);
    this.set('fullSize', true);
  },

  afterExpand: function() {
    var $pane = this.$().children('.pane');

    $pane.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', '*', function(evt) {
      evt.stopPropagation();
    });

    $pane.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
      $pane.removeClass('transition-position');
    });

    setTimeout(function() {
      $pane.addClass('transition-position').attr('style', '');
    }, 50);
  },

  collapse: function(){
    var self = this;
    var $paneWrapper = this.$();
    var $pane = $paneWrapper.children('.pane');

    $pane.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
      $pane.removeClass('transition-position');

      Ember.run.scheduleOnce('afterRender', self, self.afterCollapse);
      self.set('fullSize', false);
    });

    $pane.addClass('transition-position').css(this.originalPosition());
    $paneWrapper.css({
      'background-color': 'transparent'
    });
  },

  afterCollapse: function() {
    var $paneWrapper = this.$();
    var $pane = $paneWrapper.children('.pane');

    $pane.attr('style', '');
    $paneWrapper.attr('style', '');

    $pane.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
  },

  originalPosition: function() {
    var $paneWrapper = this.$();

    return {
      left: $paneWrapper.offset().left,
      right: $paneWrapper.offsetParent().innerWidth() - ($paneWrapper.offset().left + $paneWrapper.width()),
      top: $paneWrapper.position().top,
      bottom: $paneWrapper.offsetParent().outerHeight() - ($paneWrapper.position().top + $paneWrapper.innerHeight())
    };
  }
});

export default PaneView;
