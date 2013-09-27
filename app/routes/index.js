import ajax from 'glazier/utils/ajax';

var IndexRoute = Ember.Route.extend({
  model: function () {
    return ajax('/api/dashboards', {
      dataType: 'json'
    }).then(function(data) {
      return data.dashboards;
    });
  }
});

export default IndexRoute;
