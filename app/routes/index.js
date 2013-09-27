var IndexRoute = Ember.Route.extend({
  model: function () {
    return Ember.$.ajax({
      url: '/api/dashboards',
      dataType: 'json'
    }).then(function(data) {
      return data.dashboards;
    });
  }
});

export default IndexRoute;
