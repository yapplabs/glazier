var PaneView = Ember.View.extend({
  templateName: 'pane',
  classNameBindings: [
    'controller.isHidden:hidden-pane:visible-pane',
    ':pane-wrapper',
    'fullSize'
  ],

  fullSize: false,

  expand: function(){
    var $paneWrapper = this.$();
    var $pane = $paneWrapper.children('.pane');

    $pane.css({
      left: $paneWrapper.offset().left,
      right: $paneWrapper.parent().innerWidth() - ($paneWrapper.offset().left + $paneWrapper.width()),
      top: $paneWrapper.position().top,
      bottom: $paneWrapper.parent().height() - $paneWrapper.height()
    });

    Ember.run.scheduleOnce('afterRender', this, this.afterExpand);
    this.set('fullSize', true);
  },

  afterExpand: function() {
    var $pane = this.$().children('.pane');

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
    
    $pane.addClass('transition-position').css({
      left: $paneWrapper.offset().left,
      right: $paneWrapper.parent().innerWidth() - ($paneWrapper.offset().left + $paneWrapper.width()),
      top: $paneWrapper.position().top,
      bottom: $paneWrapper.parent().height() - $paneWrapper.height()
    });
    $paneWrapper.css({
      'background-color': 'transparent'
    });
  },

  afterCollapse: function() {
    var $paneWrapper = this.$();
    var $pane = $paneWrapper.children('.pane');

    $pane.attr('style', '');
    $paneWrapper.attr('style', '');
  }
});

export default PaneView;
