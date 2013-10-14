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
