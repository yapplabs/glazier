var IndexRoute = Ember.Route.extend({
  model: function () {
    return this.store.find('dashboard');
  }
});

export default IndexRoute;
