import 'conductor' as Conductor;

var DashboardRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);
    var id = model.get("id");
    var url ="https://api.github.com/repos/" + id;
    var self = this;
    Ember.$.ajax({
      type: 'get',
      url: url
    }).then(function(repo) {
        Ember.run(function(){
          self.controllerFor('repository_sidebar').setCurrentRepository(repo);
        });
      }).then(null, Conductor.error);
  },
  serialize: function (model, params) {
    var parts = model.id.split('/'),
        hash = {};

    Ember.assert(parts.length === 2 && params.length === 2, 'parts should equal params');

    hash[params[0]] = parts[0];
    hash[params[1]] = parts[1];

    return hash;
  },
  model: function (params) {
    var id = params.github_user + '/' + params.github_repo;
    return Glazier.Dashboard.find(id);
  }
});

export = DashboardRoute;
