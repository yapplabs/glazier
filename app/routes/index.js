var IndexRoute = Ember.Route.extend({
  model: function () {
    return Glazier.Dashboard.find();
  }
});

export default IndexRoute;
