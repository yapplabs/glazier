define("glazier/behaviors/login",
  ["ziniki"],
  function(Ziniki) {
    "use strict";
    function login() {
      // There should be a proper login screen
      return Ziniki.login("basic", "gareth", { password:"powell"});
    }
    return login;
  }
);
define("glazier/adapters/application",
	  ["ziniki/ea"],
	  function(Adapter) {
	    "use strict";

	    var ApplicationAdapter = Adapter;

	    return ApplicationAdapter;
	  });

define("glazier/serializers/application",
	  ["ziniki/sr"],
	  function(ZinikiSerializer) {
	    "use strict";

	    var ApplicationSerializer = ZinikiSerializer;

	    return ApplicationSerializer;
	  });

function login() {
  Glazier.__container__.lookup('controller:user').set('model', {});
}

function logout() {
  Glazier.__container__.lookup('controller:user').set('model', null);
}

function admin() {
  Glazier.__container__.lookup('controller:dashboard').set('isAdmin', true);
}
