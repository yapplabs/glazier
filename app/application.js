import 'glazier/router' as Router;
import 'glazier/store' as Store;
import 'resolver' as Resolver;

var Application = Ember.Application.extend({
  modulePrefix: 'glazier',
  Router: Router,
  Store: Store,
  resolver: Resolver
});

export = Application;
