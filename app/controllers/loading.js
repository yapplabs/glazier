var LoadingController = Ember.Controller.extend({
  init: function() {
    this._super();

    // Append a LoadingView separate from the typical
    // route lifecycle hooks that remains in the DOM.
    var loadingView = this.container.lookup('view:loading');
    loadingView.set('controller', this);
    this.set('loadingView', loadingView);
    loadingView.append();
  },
  isLoading: false
});

export default LoadingController;
