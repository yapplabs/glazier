import ajax from 'glazier/utils/ajax';

var IndexRoute = Ember.Route.extend({
  model: function () {
    return this.get('store').find('dashboard');
  }
});

export default IndexRoute;
