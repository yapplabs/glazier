import 'glazier/router' as Router;
import 'glazier/store' as Store;
import 'glazier/resolver' as Resolver;

var Application = Ember.Application.extend({
  Router: Router,
  Store: Store,
  resolver: Resolver
});

export = Application;
