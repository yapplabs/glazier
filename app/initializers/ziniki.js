import Ziniki from 'ziniki';
import ZinikiSerializer from 'ziniki/sr';
var host = "http://10.2.3.50:10080/ziniki";
// host = "http://172.21.145.1:10080/ziniki"
// host = "http://localhost:10080/ziniki"
// host = "http://devexp.ziniki.org:13080/ziniki"
var initializer = {
    name: 'ziniki',
    after: 'store',
		
    initialize: function (container, application) {
        Ziniki.init(host + "/resources", host + "/adapter");
        var dashboard = ZinikiSerializer.mapType(Glazier.Dashboard, "dashboard", "us.yapp.glazier.Dashboard", "us.yapp.glazier.dashboard");
        // Glazier's rails server stupidly uses non-standard ids
        dashboard.naturalKey("repository", "byRepository");

        var dashboardTypeMap = {
          idToRecord: {},
          records: [],
          metadata: {},
          addRecord: function(id, record) {
            this.idToRecord[id] = record;
            return record;
          },
          removeRecord: function(id) {
            var record = this.idToRecord[id];
            delete this.idToRecord[record.get('_ziniki_id')];
            delete this.idToRecord[record.get('id')];
          },
          setupAliases: function(store, record, data) {
            this.idToRecord[data['_ziniki_id']] = record;
          }
        };

        application.register('data-type-map:dashboard', dashboardTypeMap , { instantiate: false });

        var section = ZinikiSerializer.mapType(Glazier.Section, "section", "us.yapp.glazier.Section", "us.yapp.glazier.section");

        var pane = ZinikiSerializer.mapType(Glazier.Pane, "pane", "us.yapp.glazier.Pane", "us.yapp.glazier.pane");
	
        var paneType = ZinikiSerializer.mapType(Glazier.PaneType, "paneType", "us.yapp.glazier.PaneType", "us.yapp.glazier.paneType");
        paneType.naturalKey("name", "byName");
    }
};

export default initializer;
